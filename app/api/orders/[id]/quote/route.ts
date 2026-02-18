import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'
import { ORDER_STATES, USER_ROLES } from '@/lib/constants'

// Estados válidos en los que el técnico puede enviar una cotización
const STATES_VALID_FOR_QUOTE = [
  ORDER_STATES.ASIGNADO,
  ORDER_STATES.EN_CAMINO,
  ORDER_STATES.EN_PROCESO,
  ORDER_STATES.REVISADO,
]

// POST /api/orders/[id]/quote - Enviar cotización
export const POST = withAuth(async (req: NextRequest, user: AuthenticatedUser, { params }: { params: { id: string } }) => {
  try {
    const orderId = params.id
    const body = await req.json()
    const { diagnostico, costoEstimado } = body

    // 1. Validar datos básicos
    if (!diagnostico || typeof diagnostico !== 'string' || diagnostico.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: 'El diagnóstico debe tener al menos 20 caracteres' },
        { status: 400 }
      )
    }

    if (typeof costoEstimado !== 'number' || !isFinite(costoEstimado) || costoEstimado <= 0) {
      return NextResponse.json(
        { success: false, error: 'El costo estimado debe ser un valor en pesos colombianos mayor a $0' },
        { status: 400 }
      )
    }

    // 2. Obtener la orden
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

    // 3. Validar estado: solo se puede cotizar en estados específicos
    if (!STATES_VALID_FOR_QUOTE.includes(order.estado as any)) {
      return NextResponse.json(
        {
          success: false,
          error: `No se puede enviar cotización en el estado actual (${order.estado}). Estados válidos: ${STATES_VALID_FOR_QUOTE.join(', ')}`
        },
        { status: 400 }
      )
    }

    // 4. Rechazar si ya hay una cotización pendiente de aprobación del cliente
    if (order.estado === ORDER_STATES.COTIZADO) {
      return NextResponse.json(
        { success: false, error: 'Ya existe una cotización pendiente de aprobación por parte del cliente. No se puede sobreescribir.' },
        { status: 409 }
      )
    }

    // 5. Verificar permisos: Solo técnico asignado o admin
    let isAssignedTechnician = false
    if (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN) {
      isAssignedTechnician = true
    } else {
      const tech = await prisma.technician.findUnique({ where: { email: user.email } })
      if (tech) {
        isAssignedTechnician = order.assignments.some(a => a.technicianId === tech.id && a.estado !== 'cancelado')
      }
    }

    if (!isAssignedTechnician) {
      return NextResponse.json(
        { success: false, error: 'No tienes permiso para cotizar esta orden' },
        { status: 403 }
      )
    }

    // 6. Ejecutar transacción
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Actualizar la orden: solo el estado y el costoEstimado
      // NO se sobreescribe descripcionProblema (pertenece al cliente)
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          estado: ORDER_STATES.COTIZADO,
          costoEstimado: costoEstimado,
        }
      })

      // Registrar en Historial con diagnóstico completo en metadata
      await tx.orderHistory.create({
        data: {
          orderId,
          estadoAnterior: order.estado,
          estadoNuevo: ORDER_STATES.COTIZADO,
          changedBy: user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN ? 'admin' : 'technician',
          changedById: user.id.toString(),
          notas: `Cotización enviada: $${costoEstimado.toLocaleString('es-CO')} COP`,
          metadata: {
            diagnosticoTecnico: diagnostico,
            costoEstimadoCOP: costoEstimado
          }
        }
      })

      // Notificar al cliente para que apruebe/rechace
      if (order.customerId) {
        await tx.notification.create({
          data: {
            userId: order.customerId.toString(),
            userType: 'customer',
            tipo: 'system',
            canal: 'system',
            destinatario: order.email,
            asunto: `Cotización recibida — Orden ${order.orderNumber}`,
            mensaje: `El técnico ha enviado una cotización de $${costoEstimado.toLocaleString('es-CO')} COP. Ingresa a "Mis Servicios" para aprobarla o rechazarla.`,
            metadata: {
              link: `/customer/services`,
              orderId: order.id,
              orderNumber: order.orderNumber
            },
            enviado: true,
            fechaEnvio: new Date(),
          }
        })
      }

      return updated
    })

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: `Cotización de $${costoEstimado.toLocaleString('es-CO')} COP enviada exitosamente. El cliente recibirá una notificación.`
    })

  } catch (error) {
    console.error('Error enviando cotización:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
