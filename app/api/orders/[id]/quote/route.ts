import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'
import { ORDER_STATES, USER_ROLES } from '@/lib/constants'

// POST /api/orders/[id]/quote - Enviar cotización
export const POST = withAuth(async (req: NextRequest, user: AuthenticatedUser, { params }: { params: { id: string } }) => {
  try {
    const orderId = params.id
    const body = await req.json()
    const { diagnostico, costoEstimado } = body

    // Validar datos básicos
    if (!diagnostico || typeof costoEstimado !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos (diagnóstico o costo)' },
        { status: 400 }
      )
    }

    // Verificar permisos: Solo técnicos asignados o admins
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

    // Verificar si es técnico asignado
    let isAssignedTechnician = false
    if (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN) {
      isAssignedTechnician = true
    } else {
      // Buscar ID de técnico del usuario actual
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

    // Ejecutar transacción
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. Actualizar Orden
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          estado: ORDER_STATES.COTIZADO,
          costoEstimado: costoEstimado,
          descripcionProblema: diagnostico, // Actualizamos con el diagnóstico técnico más preciso
        }
      })

      // 2. Registrar en Historial
      await tx.orderHistory.create({
        data: {
          orderId,
          estadoAnterior: order.estado,
          estadoNuevo: ORDER_STATES.COTIZADO,
          changedBy: 'technician', // O 'admin' si fuera el caso, simplificado a quien ejecuta
          changedById: user.id.toString(),
          notas: `Cotización enviada: $${costoEstimado.toLocaleString('es-CO')}. Diagnóstico: ${diagnostico.substring(0, 50)}...`,
          metadata: {
            diagnosticoFull: diagnostico,
            costo: costoEstimado
          }
        }
      })

      // 3. Crear Notificación para el cliente
      if (order.customerId) {
        await tx.notification.create({
          data: {
            userId: order.customerId.toString(),
            userType: 'customer',
            tipo: 'system',
            destinatario: order.email, // Campo requerido faltante
            asunto: `Cotización recibida para orden ${order.orderNumber}`,
            mensaje: `El técnico ha enviado una cotización de $${costoEstimado.toLocaleString('es-CO')} para tu servicio. Por favor revísala y apruébala para continuar.`,
            metadata: {
              actionUrl: `/customer/services?order=${order.orderNumber}`,
              orderId: order.id
            }
          }
        })
      }

      return updated
    })

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Cotización enviada exitosamente'
    })

  } catch (error) {
    console.error('Error enviando cotización:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
