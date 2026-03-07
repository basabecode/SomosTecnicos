import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'
import { ORDER_STATES, USER_ROLES } from '@/lib/constants'
import { isValidTransition } from '@/lib/state-machine'
import { getCostoVisitaTecnica } from '@/lib/order-utils'

// PATCH /api/orders/[id]/approve - Aprobar o Rechazar Cotización (cliente)
export const PATCH = withAuth(async (req: NextRequest, user: AuthenticatedUser, { params }: { params: { id: string } }) => {
  try {
    const orderId = params.id
    const body = await req.json()
    const { action } = body // 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Acción inválida. Use "approve" o "reject"' },
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

    // Solo el cliente dueño de la orden puede aprobar/rechazar
    if (user.role === USER_ROLES.CUSTOMER && order.customerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'No tienes permiso sobre esta orden' },
        { status: 403 }
      )
    }

    // Solo se puede actuar si la orden está en estado COTIZADO
    if (order.estado !== ORDER_STATES.COTIZADO) {
      return NextResponse.json(
        { success: false, error: `La orden no tiene una cotización pendiente (estado actual: ${order.estado})` },
        { status: 400 }
      )
    }

    const costoEstimadoStr = order.costoEstimado
      ? Number(order.costoEstimado).toLocaleString('es-CO')
      : '0'

    const updatedOrder = await prisma.$transaction(async (tx) => {
      let newState: string
      let costoFinalVal: number | null = null
      let notasHistorial = ''

      if (action === 'approve') {
        newState = ORDER_STATES.EN_PROCESO
        notasHistorial = `Cliente aprobó la cotización de $${costoEstimadoStr} COP`
      } else {
        newState = ORDER_STATES.CANCELADO
        const costoVisita = await getCostoVisitaTecnica()
        costoFinalVal = costoVisita
        notasHistorial = `Cliente rechazó la cotización. Se cobra visita técnica: $${costoVisita.toLocaleString('es-CO')} COP`
      }

      // 1. Actualizar Orden
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          estado: newState,
          costoFinal: costoFinalVal !== null ? costoFinalVal : undefined,
          fechaCompletado: action === 'reject' ? new Date() : undefined
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
            costoEstimadoOriginal: order.costoEstimado?.toString(),
            ip: req.headers.get('x-forwarded-for') || 'unknown'
          }
        }
      })

      // 3. Notificar al técnico asignado con estado activo
      const activeAssignment = order.assignments.find(a =>
        ['asignado', 'en_camino', 'en_proceso'].includes(a.estado)
      )

      if (activeAssignment) {
        const technician = await tx.technician.findUnique({
          where: { id: activeAssignment.technicianId }
        })

        if (technician) {
          const techAsunto = action === 'approve'
            ? `Cotización aprobada — Orden ${order.orderNumber}`
            : `Cotización rechazada — Orden ${order.orderNumber}`

          const techMensaje = action === 'approve'
            ? `El cliente aprobó tu cotización de $${costoEstimadoStr} COP para la orden ${order.orderNumber}. Puedes proceder con el servicio.`
            : `El cliente rechazó tu cotización para la orden ${order.orderNumber}. La orden ha sido cancelada.`

          await tx.notification.create({
            data: {
              userId: technician.id.toString(),
              userType: 'technician',
              tipo: 'system',
              canal: 'system',
              destinatario: technician.email,
              asunto: techAsunto,
              mensaje: techMensaje,
              metadata: {
                link: `/technician/assignments`,
                orderId: order.id,
                orderNumber: order.orderNumber,
                accion: action
              },
              enviado: true,
              fechaEnvio: new Date(),
            }
          })
        }
      }

      return updated
    })

    const successMessage = action === 'approve'
      ? 'Cotización aprobada. El técnico continuará con el servicio.'
      : 'Cotización rechazada. Se cobrará únicamente la visita técnica.'

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: successMessage
    })

  } catch (error) {
    console.error('Error procesando decisión de cotización:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
