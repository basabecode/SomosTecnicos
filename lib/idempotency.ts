/**
 * Middleware de Idempotencia para APIs
 *
 * Previene el procesamiento duplicado de requests con el mismo idempotency key.
 * Implementa el patrón de idempotencia recomendado para APIs RESTful.
 *
 * Uso:
 * ```typescript
 * export async function POST(request: Request) {
 *   return withIdempotency(request, async (req) => {
 *     // Tu lógica de procesamiento aquí
 *     const data = await req.json()
 *     const result = await processData(data)
 *     return NextResponse.json(result, { status: 201 })
 *   })
 * }
 * ```
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

const IDEMPOTENCY_HEADER = 'x-idempotency-key'
const IDEMPOTENCY_TTL_HOURS = 24

/**
 * Envuelve un handler de API para agregar soporte de idempotencia
 *
 * @param request - Request de Next.js
 * @param handler - Función async que procesa el request y retorna NextResponse
 * @param options - Opciones de configuración
 * @returns NextResponse con el resultado del handler o respuesta cacheada
 */
export async function withIdempotency(
  request: Request,
  handler: (req: Request) => Promise<NextResponse>,
  options: {
    required?: boolean // Si true, requiere idempotency key obligatorio
    ttlHours?: number  // Horas antes de expirar (default 24)
  } = {}
): Promise<NextResponse> {
  const { required = false, ttlHours = IDEMPOTENCY_TTL_HOURS } = options

  // Extraer idempotency key del header
  const idempotencyKey = request.headers.get(IDEMPOTENCY_HEADER)

  // Si no hay key y es requerida, retornar error
  if (!idempotencyKey && required) {
    logger.warn('Missing required idempotency key', {
      url: request.url,
      method: request.method
    })
    return NextResponse.json(
      {
        error: 'Missing idempotency key',
        message: `Header '${IDEMPOTENCY_HEADER}' is required for this operation`
      },
      { status: 400 }
    )
  }

  // Si no hay key y no es requerida, ejecutar handler normalmente
  if (!idempotencyKey) {
    return handler(request)
  }

  // Validar formato del key (debe tener al menos 10 caracteres)
  if (idempotencyKey.length < 10) {
    logger.warn('Invalid idempotency key format', {
      key: idempotencyKey,
      url: request.url
    })
    return NextResponse.json(
      {
        error: 'Invalid idempotency key',
        message: 'Idempotency key must be at least 10 characters long'
      },
      { status: 400 }
    )
  }

  try {
    // Verificar si ya existe una respuesta cacheada
    const existingRequest = await prisma.idempotentRequest.findUnique({
      where: { key: idempotencyKey },
      select: {
        response: true,
        statusCode: true,
        createdAt: true,
        expiresAt: true
      }
    })

    if (existingRequest) {
      const now = new Date()

      // Si la respuesta expiró, eliminarla y procesar de nuevo
      if (existingRequest.expiresAt < now) {
        await prisma.idempotentRequest.delete({
          where: { key: idempotencyKey }
        })
        logger.info('Expired idempotent request deleted', { key: idempotencyKey })
      } else {
        // Retornar respuesta cacheada
        logger.info('Returning cached idempotent response', {
          key: idempotencyKey,
          statusCode: existingRequest.statusCode,
          cachedAt: existingRequest.createdAt
        })

        return NextResponse.json(
          existingRequest.response,
          {
            status: existingRequest.statusCode,
            headers: {
              'X-Idempotent-Replayed': 'true',
              'X-Original-Request-Time': existingRequest.createdAt.toISOString()
            }
          }
        )
      }
    }

    // Procesar el request por primera vez
    logger.info('Processing new idempotent request', {
      key: idempotencyKey,
      url: request.url
    })

    const response = await handler(request)

    // Capturar el body de la respuesta
    const responseClone = response.clone()
    const responseData = await responseClone.json()
    const statusCode = response.status

    // Guardar solo respuestas exitosas (2xx y 3xx)
    if (statusCode >= 200 && statusCode < 400) {
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + ttlHours)

      await prisma.idempotentRequest.create({
        data: {
          key: idempotencyKey,
          response: responseData,
          statusCode: statusCode,
          expiresAt: expiresAt
        }
      })

      logger.info('Idempotent request cached', {
        key: idempotencyKey,
        statusCode,
        expiresAt
      })
    } else {
      // No cachear errores 4xx o 5xx
      logger.info('Not caching error response', {
        key: idempotencyKey,
        statusCode
      })
    }

    // Retornar respuesta original
    return NextResponse.json(responseData, {
      status: statusCode,
      headers: {
        'X-Idempotent-Replayed': 'false'
      }
    })

  } catch (error) {
    logger.error('Error in idempotency middleware', {
      error: error instanceof Error ? error : new Error(String(error)),
      key: idempotencyKey,
      url: request.url
    })

    // En caso de error del middleware, ejecutar handler sin idempotencia
    return handler(request)
  }
}

/**
 * Limpia requests idempotentes expirados de la base de datos
 * Ejecutar periódicamente vía cron job o tarea programada
 */
export async function cleanupExpiredIdempotentRequests(): Promise<number> {
  try {
    const result = await prisma.idempotentRequest.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })

    logger.info('Cleaned up expired idempotent requests', {
      count: result.count
    })

    return result.count
  } catch (error) {
    logger.error('Error cleaning up expired idempotent requests', {
      error: error instanceof Error ? error : new Error(String(error))
    })
    return 0
  }
}

/**
 * Genera un idempotency key único basado en contenido del request
 * Útil para generar keys del lado del servidor cuando el cliente no los provee
 *
 * @param prefix - Prefijo para el key (ej: 'order', 'payment')
 * @param data - Datos del request para generar hash
 * @returns Idempotency key único
 */
export function generateIdempotencyKey(prefix: string, data?: unknown): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)

  // Si hay data, incluir un hash simple
  let dataHash = ''
  if (data) {
    dataHash = `-${JSON.stringify(data).length}-${typeof data}`
  }

  return `${prefix}-${timestamp}-${random}${dataHash}`
}
