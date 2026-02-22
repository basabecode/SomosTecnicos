/**
 * DELETE /api/notifications/clear
 * Elimina permanentemente las notificaciones ya leídas del usuario actual.
 * Invocado por clearReadNotifications() en notification-context.tsx
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'

export const DELETE = withAuth(async (_request: NextRequest, user: AuthenticatedUser) => {
  try {
    const userType = user.role.toLowerCase()
    const isAdmin = ['admin', 'super_admin', 'technician_manager'].includes(userType)

    // Para admins, limpiar también las notificaciones generales de soporte ya leídas
    const whereClause = isAdmin
      ? {
          OR: [
            { userId: user.id.toString(), userType },
            { userId: '0', userType: { in: ['admin', 'support'] } },
          ],
          read: true,
        }
      : {
          userId: user.id.toString(),
          userType,
          read: true,
        }

    const result = await prisma.notification.deleteMany({
      where: whereClause,
    })

    return NextResponse.json({
      success: true,
      message: `${result.count} notificación(es) leída(s) eliminada(s)`,
      count: result.count,
    })
  } catch (error) {
    console.error('[DELETE /api/notifications/clear] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
