/**
 * SSE - Stream de Notificaciones en Tiempo Real
 * GET /api/notifications/stream?token=<jwt>
 *
 * Usa Server-Sent Events para entregar notificaciones nuevas sin polling de 60s.
 * El token se pasa como query param porque EventSource del navegador no soporta headers custom.
 *
 * Runtime: Node.js con maxDuration=300 (5 min en Vercel Pro, 60s en Hobby).
 * Edge Runtime no es viable con @prisma/client estándar — requeriría Prisma Accelerate.
 * Para Vercel Hobby: el cliente reconecta automáticamente cada 60s (comportamiento aceptable).
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 min en Vercel Pro | 60s en Hobby (reconexión automática)

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

      // Contar no leídas + enviar las pendientes al conectar (sincroniza badge inicial)
      try {
        const [unreadCount, pendingNotifications] = await Promise.all([
          prisma.notification.count({
            where: {
              OR: [
                { userId, userType: userRole, read: false },
                ...(isAdmin
                  ? [{ userId: '0', userType: { in: ['admin', 'support'] }, read: false }]
                  : [])
              ]
            }
          }),
          prisma.notification.findMany({
            where: {
              OR: [
                { userId, userType: userRole, read: false },
                ...(isAdmin
                  ? [{ userId: '0', userType: { in: ['admin', 'support'] }, read: false }]
                  : [])
              ]
            },
            orderBy: { id: 'desc' },
            take: 20
          })
        ])

        send({ type: 'connected', unreadCount, notifications: pendingNotifications })
      } catch {
        send({ type: 'connected', unreadCount: 0, notifications: [] })
      }

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
      'X-Accel-Buffering': 'no'
    }
  })
}
