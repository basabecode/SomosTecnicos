import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'

/**
 * DELETE /api/messages/thread/[threadId]
 * Elimina todos los mensajes de una conversación específica
 * Solo el propietario de los mensajes puede eliminarlos
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

    console.log('[DELETE Thread] User:', user.id, 'ThreadId:', threadId)

    // Decodificar el threadId para obtener los IDs relevantes
    // Formato esperado: "order-{orderId}" o "direct-{userId}"
    let deleteCondition: any = {}

    if (threadId.startsWith('order-')) {
      const orderId = threadId.replace('order-', '')
      console.log('[DELETE Thread] Order-based deletion, orderId:', orderId)

      // Eliminar mensajes de esta orden donde el usuario es sender o receiver
      deleteCondition = {
        AND: [
          { orderId: orderId },
          {
            OR: [
              { senderId: String(user.id) },
              { receiverId: String(user.id) }
            ]
          }
        ]
      }
    } else if (threadId.startsWith('direct-')) {
      const partnerId = threadId.replace('direct-', '')
      console.log('[DELETE Thread] Direct deletion, partnerId:', partnerId)

      // Normalizar partnerId para soporte
      const normalizedPartnerId = partnerId === 'support' ? '0' : partnerId

      // Si el usuario es ADMIN, también debe poder eliminar mensajes enviados a/desde '0' (Soporte)
      const isAdmin = ['admin', 'super_admin', 'technician_manager'].includes(user.role)

      // Array de IDs que representan al usuario actual
      const myIds = [String(user.id)]
      if (isAdmin) {
          myIds.push('0') // El admin también es '0' (Soporte)
      }

      deleteCondition = {
        OR: [
          // Mensajes que YO envié al Partner
          {
            AND: [
              { senderId: { in: myIds } },
              { receiverId: normalizedPartnerId }
            ]
          },
          // Mensajes que el Partner ME envió
          {
            AND: [
              { senderId: normalizedPartnerId },
              { receiverId: { in: myIds } }
            ]
          }
        ]
      }
    } else {
      console.error('[DELETE Thread] Invalid threadId format:', threadId)
      return NextResponse.json(
        { error: 'Formato de threadId inválido' },
        { status: 400 }
      )
    }

    console.log('[DELETE Thread] Delete condition:', JSON.stringify(deleteCondition, null, 2))

    // Eliminar los mensajes
    const result = await prisma.message.deleteMany({
      where: deleteCondition
    })

    console.log('[DELETE Thread] Deleted count:', result.count)

    return NextResponse.json({
      success: true,
      message: `${result.count} mensaje(s) eliminado(s)`,
      deletedCount: result.count
    })
  } catch (error) {
    console.error('[DELETE Thread] Error:', error)
    // Mostrar más detalles del error
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    const errorStack = error instanceof Error ? error.stack : ''
    console.error('[DELETE Thread] Error details:', errorMessage, errorStack)

    return NextResponse.json(
      {
        error: 'Error al eliminar la conversación',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
