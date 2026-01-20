/**
 * API de Notificaciones
 * GET /api/notifications - Obtener notificaciones del usuario actual
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'

export const GET = withAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'))
    const onlyUnread = searchParams.get('unread') === 'true'

    // Mapear rol de AuthenticatedUser a userType de Notification
    const isAdmin = ['admin', 'super_admin', 'technician_manager'].includes(user.role.toLowerCase())
    const userType = user.role.toLowerCase()

    const whereClause: any = {
      OR: [
        {
          userId: user.id.toString(),
          userType: userType
        },
        // Los admins también ven notificaciones dirigidas a soporte/admin general
        ...(isAdmin ? [
          {
            userId: '0',
            userType: { in: ['admin', 'support'] }
          }
        ] : [])
      ],
      ...(onlyUnread ? { read: false } : {})
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    const unreadCount = await prisma.notification.count({
      where: {
        ...whereClause,
        read: false
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount
      }
    })

  } catch (error) {
    console.error('Error obteniendo notificaciones:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})

/**
 * POST /api/notifications/read-all - Marcar todas como leídas
 */
export const POST = withAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const userType = user.role.toLowerCase()

    await prisma.notification.updateMany({
      where: {
        userId: user.id.toString(),
        userType: userType,
        read: false
      },
      data: {
        read: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Todas las notificaciones marcadas como leídas'
    })

  } catch (error) {
    console.error('Error marcando notificaciones como leídas:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
