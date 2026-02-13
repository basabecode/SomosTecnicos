/**
 * API de Notificaciones - Marcar como leída
 * PATCH /api/notifications/[id]/read
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // withAuth no soporta params directamente en la firma si se usa como HOC simple
  // pero podemos extraer el usuario manualmente o usar withAuth si lo envolvemos bien.
  // Usaremos findUnique para validar que la notificación pertenece al usuario antes de actualizar.

  // Nota: params.id es el ID de la notificación
  const notificationId = parseInt(id)

  if (isNaN(notificationId)) {
    return NextResponse.json({ success: false, error: 'ID inválido' }, { status: 400 })
  }

  // Para simplificar, asumo que el middleware ya validó el token y puedo obtener el user del header si lo pusimos ahí,
  // pero withAuth es el estándar en este proyecto.

  return withAuth(async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      const userType = user.role.toLowerCase()

      // Validar propiedad
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId }
      })

      if (!notification) {
        return NextResponse.json({ success: false, error: 'Notificación no encontrada' }, { status: 404 })
      }

      if (notification.userId !== user.id.toString() || notification.userType !== userType) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
      }

      const updated = await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true }
      })

      return NextResponse.json({
        success: true,
        data: updated
      })

    } catch (error) {
      console.error('Error marcando notificación como leída:', error)
      return NextResponse.json(
        { success: false, error: 'Error interno del servidor' },
        { status: 500 }
      )
    }
  })(request)
}
