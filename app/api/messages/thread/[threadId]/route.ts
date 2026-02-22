import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'

/**
 * DELETE /api/messages/thread/[threadId]
 * Soft-delete de una conversación para el usuario que hace la petición.
 * El otro participante conserva sus mensajes intactos.
 */
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ threadId: string }> }
) {
  try {
    const params = await props.params
    const auth = await authenticateRequest(request)
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { user } = auth
    const { threadId } = params

    // Normalizar el tipo de usuario
    let userType = 'customer'
    if (user.role === 'technician') userType = 'technician'
    if (['admin', 'super_admin', 'technician_manager'].includes(user.role)) userType = 'admin'

    const isAdmin = userType === 'admin'
    const myIds = [String(user.id)]
    if (isAdmin) myIds.push('0')

    let deletedCount = 0

    if (threadId.startsWith('order-')) {
      const orderId = threadId.replace('order-', '')

      // Marcar como borrado para el remitente (mensajes que yo envié)
      const asSender = await prisma.message.updateMany({
        where: {
          orderId,
          senderId: { in: myIds },
          senderType: userType,
          deletedBySender: false
        },
        data: { deletedBySender: true }
      })

      // Marcar como borrado para el receptor (mensajes que yo recibí)
      const asReceiver = await prisma.message.updateMany({
        where: {
          orderId,
          receiverId: { in: myIds },
          deletedByReceiver: false
        },
        data: { deletedByReceiver: true }
      })

      deletedCount = asSender.count + asReceiver.count

    } else if (threadId.startsWith('direct-')) {
      const partnerId = threadId.replace('direct-', '')
      const normalizedPartnerId = partnerId === 'support' ? '0' : partnerId

      // Mensajes que YO envié al partner → soy el remitente
      const asSender = await prisma.message.updateMany({
        where: {
          senderId: { in: myIds },
          receiverId: normalizedPartnerId,
          deletedBySender: false
        },
        data: { deletedBySender: true }
      })

      // Mensajes que el partner me envió → soy el receptor
      const asReceiver = await prisma.message.updateMany({
        where: {
          senderId: normalizedPartnerId,
          receiverId: { in: myIds },
          deletedByReceiver: false
        },
        data: { deletedByReceiver: true }
      })

      deletedCount = asSender.count + asReceiver.count

    } else {
      return NextResponse.json(
        { error: 'Formato de threadId inválido' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `${deletedCount} mensaje(s) eliminado(s) de tu vista`,
      deletedCount
    })

  } catch (error) {
    console.error('[DELETE Thread] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json(
      {
        error: 'Error al eliminar la conversación',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
