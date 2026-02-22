/**
 * POST /api/notifications/read-all
 * Marca todas las notificaciones del usuario actual como leídas.
 * Invocado por markAllAsRead() en notification-context.tsx
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'

export const POST = withAuth(async (_request: NextRequest, user: AuthenticatedUser) => {
  try {
    const userType = user.role.toLowerCase()
    const isAdmin = ['admin', 'super_admin', 'technician_manager'].includes(userType)

    // Para admins, marcar también las notificaciones generales de soporte
    const whereClause = isAdmin
      ? {
          OR: [
            { userId: user.id.toString(), userType },
            { userId: '0', userType: { in: ['admin', 'support'] } },
          ],
          read: false,
        }
      : {
          userId: user.id.toString(),
          userType,
          read: false,
        }

    const result = await prisma.notification.updateMany({
      where: whereClause,
      data: { read: true },
    })

    return NextResponse.json({
      success: true,
      message: `${result.count} notificación(es) marcada(s) como leída(s)`,
      count: result.count,
    })
  } catch (error) {
    console.error('[POST /api/notifications/read-all] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
