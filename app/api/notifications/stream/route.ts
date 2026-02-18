/**
 * SSE - Stream de Notificaciones en Tiempo Real
 * GET /api/notifications/stream?token=<jwt>
 *
 * Usa Server-Sent Events para entregar notificaciones nuevas sin polling de 60s.
 * El token se pasa como query param porque EventSource del navegador no soporta headers custom.
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const POLL_INTERVAL_MS = 5000

export async function GET(request: NextRequest) {
  // 1. Autenticación por query param (EventSource no admite Authorization header)
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return new Response('Unauthorized', { status: 401 })
  }

  const user = verifyToken(token)
  if (!user || !user.activo) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = user.id.toString()
  const userRole = user.role.toLowerCase()

  // Cláusula WHERE para notificaciones del usuario
  const isAdmin = ['admin', 'super_admin', 'technician_manager', 'viewer'].includes(userRole)
  const buildWhere = (minId: number) => ({
    AND: [
      { id: { gt: minId } },
      {
        OR: [
          { userId, userType: userRole },
          // Admins también ven notificaciones con userId='0' (legado)
          ...(isAdmin
            ? [{ userId: '0', userType: { in: ['admin', 'support'] } }]
            : [])
        ]
      }
    ]
  })

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          )
        } catch {
          // El stream ya fue cerrado
        }
      }

      // Obtener el ID más alto actual para no re-enviar notificaciones anteriores
      let lastId = 0
      try {
        const latest = await prisma.notification.findFirst({
          where: buildWhere(-1),
          orderBy: { id: 'desc' },
          select: { id: true }
        })
        lastId = latest?.id ?? 0
      } catch {
        lastId = 0
      }

      // Contar no leídas al conectar (para sincronizar badge inicial)
      let unreadCount = 0
      try {
        unreadCount = await prisma.notification.count({
          where: {
            OR: [
              { userId, userType: userRole, read: false },
              ...(isAdmin
                ? [{ userId: '0', userType: { in: ['admin', 'support'] }, read: false }]
                : [])
            ]
          }
        })
      } catch {
        unreadCount = 0
      }

      send({ type: 'connected', unreadCount })

      // Polling al servidor cada POLL_INTERVAL_MS ms
      const interval = setInterval(async () => {
        try {
          const newNotifications = await prisma.notification.findMany({
            where: buildWhere(lastId),
            orderBy: { id: 'asc' }
          })

          if (newNotifications.length > 0) {
            lastId = newNotifications[newNotifications.length - 1].id
            send({
              type: 'new_notifications',
              notifications: newNotifications,
              count: newNotifications.length
            })
          }
        } catch {
          // Error de BD — continuar en el siguiente tick
        }
      }, POLL_INTERVAL_MS)

      // Limpieza cuando el cliente se desconecta
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        try {
          controller.close()
        } catch {
          // ya cerrado
        }
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Deshabilitar buffering en proxies (nginx)
    }
  })
}
