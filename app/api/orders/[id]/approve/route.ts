import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'
import { ORDER_STATES, USER_ROLES } from '@/lib/constants'
import { getCostoVisitaTecnica } from '@/lib/order-utils'

// PATCH /api/orders/[id]/approve - Aprobar o Rechazar Cotización
export const PATCH = withAuth(async (req: NextRequest, user: AuthenticatedUser, { params }: { params: { id: string } }) => {
  try {
    const orderId = params.id
    const body = await req.json()
    const { action } = body // 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Acción inválida' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { assignments: true }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que sea el cliente dueño de la orden (o admin)
    if (user.role === USER_ROLES.CUSTOMER && order.customerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'No tienes permiso sobre esta orden' },
        { status: 403 }
      )
    }

    // Solo se puede aprobar si está COTIZADO
    if (order.estado !== ORDER_STATES.COTIZADO) {
      return NextResponse.json(
        { success: false, error: 'La orden no está en estado de cotización' },
        { status: 400 }
      )
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      let newState: string = ORDER_STATES.EN_PROCESO
      let costoFinal = null
      let notasHistorial = ''

      if (action === 'approve') {
        newState = ORDER_STATES.EN_PROCESO
        notasHistorial = 'Cliente aprobó la cotización via portal'
        // El costo final se definirá al cerrar la orden, por ahora sigue siendo estimado
      } else {
        newState = ORDER_STATES.CANCELADO
        // Si rechaza, se cobra la visita técnica
        const costoVisita = await getCostoVisitaTecnica()
        costoFinal = costoVisita
        notasHistorial = `Cliente rechazó la cotización. Se cobra visita técnica: $${costoVisita}`
      }

      // 1. Actualizar Orden
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          estado: newState,
          costoFinal: costoFinal ? costoFinal : undefined,
          fechaCompletado: action === 'reject' ? new Date() : undefined // Si rechaza, se termina
        }
      })

      // 2. Historial
      await tx.orderHistory.create({
        data: {
          orderId,
          estadoAnterior: order.estado,
          estadoNuevo: newState,
          changedBy: 'customer',
          changedById: user.id.toString(),
          notas: notasHistorial,
          metadata: {
            accion: action,
            ip: req.headers.get('x-forwarded-for') || 'unknown'
          }
        }
      })

      // 3. Notificar al técnico (si hay asignado)
      // Buscar técnico asignado activo
      const activeAssignment = order.assignments.find(a =>
        a.estado === 'asignado' || a.estado === 'en_camino' || a.estado === 'en_proceso' || a.estado === 'asignado' // Simplificado
      )

      if (activeAssignment) {
        // Buscar usuario asociado al técnico (si existe, asumiendo relación por email o similar)
        // Por ahora notificar al admin o sistema
        // TODO: Implementar notificación real al técnico
      }

      return updated
    })

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: action === 'approve' ? 'Cotización aprobada' : 'Cotización rechazada'
    })

  } catch (error) {
    console.error('Error aprobando cotización:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
