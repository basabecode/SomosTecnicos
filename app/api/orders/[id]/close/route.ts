import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'
import { ORDER_STATES, USER_ROLES } from '@/lib/constants'

// PATCH /api/orders/[id]/close - Cerrar Servicio (Técnico o Admin)
export const PATCH = withAuth(async (req: NextRequest, user: AuthenticatedUser, { params }: { params: { id: string } }) => {
  try {
    const orderId = params.id
    const body = await req.json()
    const {
      descripcion,
      costoFinal,
      estadoCierre // 'reparado' | 'no_reparable' | 'seguimiento'
    } = body

    // 1. Validar descripción
    if (!descripcion || typeof descripcion !== 'string' || descripcion.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'La descripción del cierre debe tener al menos 10 caracteres' },
        { status: 400 }
      )
    }

    // 2. Validar costoFinal: número finito no negativo (en pesos colombianos)
    const numCostoFinal = parseFloat(String(costoFinal))
    if (costoFinal === undefined || costoFinal === null || isNaN(numCostoFinal) || numCostoFinal < 0) {
      return NextResponse.json(
        { success: false, error: 'El costo final debe ser un valor en pesos colombianos mayor o igual a $0' },
        { status: 400 }
      )
    }

    // 3. Validar estadoCierre
    if (!['reparado', 'no_reparable', 'seguimiento'].includes(estadoCierre)) {
      return NextResponse.json(
        { success: false, error: 'Estado de cierre inválido. Use: reparado, no_reparable o seguimiento' },
        { status: 400 }
      )
    }

    // 4. Obtener la orden con asignaciones
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

    // 5. Verificar permisos (Técnico asignado o Admin)
    const isAdmin = user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN
    let isAssignedTechnician = isAdmin

    if (!isAdmin) {
      const tech = await prisma.technician.findUnique({ where: { email: user.email } })
      if (tech) {
        const assignment = order.assignments.find(a =>
          a.technicianId === tech.id && !['cancelado', 'completado'].includes(a.estado)
        )
        if (assignment) isAssignedTechnician = true
      }
    }

    if (!isAssignedTechnician) {
      return NextResponse.json(
        { success: false, error: 'No tienes permiso para cerrar esta orden' },
        { status: 403 }
      )
    }

    // 6. Determinar nuevo estado de la orden
    let newOrderState: string
    let notasHistorial = ''

    switch (estadoCierre) {
      case 'reparado':
        newOrderState = ORDER_STATES.REPARADO
        notasHistorial = `Reparación exitosa. Costo final: $${numCostoFinal.toLocaleString('es-CO')} COP`
        break
      case 'no_reparable':
        newOrderState = ORDER_STATES.CANCELADO
        notasHistorial = `Equipo no reparable. Se cobró revisión: $${numCostoFinal.toLocaleString('es-CO')} COP`
        break
      case 'seguimiento':
        newOrderState = ORDER_STATES.REAGENDADO
        notasHistorial = `Requiere seguimiento. Visita completada. Costo parcial: $${numCostoFinal.toLocaleString('es-CO')} COP`
        break
      default:
        return NextResponse.json({ success: false, error: 'Estado de cierre inválido' }, { status: 400 })
    }

    // 7. Ejecutar transacción
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar la Orden
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          estado: newOrderState,
          costoFinal: numCostoFinal,
          fechaCompletado: new Date()
        }
      })

      // Actualizar la asignación activa buscando por id de asignación (no por email del usuario)
      // Esto funciona correctamente tanto para técnicos como para admins
      const activeAssignment = order.assignments.find(a =>
        !['cancelado', 'completado'].includes(a.estado)
      )

      if (activeAssignment) {
        await tx.assignment.update({
          where: { id: activeAssignment.id },
          data: {
            estado: 'completado',
            fechaCompletada: new Date(),
            notasTecnico: `[${estadoCierre.toUpperCase()}] ${descripcion.trim()}`
          }
        })

        // Liberar al técnico si ya no tiene más asignaciones activas
        const otherActive = await tx.assignment.count({
          where: {
            technicianId: activeAssignment.technicianId,
            estado: { in: ['asignado', 'en_camino', 'en_proceso'] },
            id: { not: activeAssignment.id }
          }
        })

        if (otherActive === 0) {
          await tx.technician.update({
            where: { id: activeAssignment.technicianId },
            data: { disponible: true, estadoActual: 'disponible' }
          })
        }

        // Notificar al cliente sobre el resultado del servicio
        if (order.customerId) {
          const clienteMensaje =
            estadoCierre === 'reparado'
              ? `Tu equipo fue reparado exitosamente. Costo final: $${numCostoFinal.toLocaleString('es-CO')} COP.`
              : estadoCierre === 'no_reparable'
                ? `Tu equipo no pudo ser reparado. Se cobró únicamente la visita técnica: $${numCostoFinal.toLocaleString('es-CO')} COP.`
                : `El técnico completó la visita. El servicio requiere seguimiento adicional. Nos contactaremos pronto.`

          const clienteAsunto =
            estadoCierre === 'reparado'
              ? `Servicio completado — Orden ${order.orderNumber}`
              : estadoCierre === 'no_reparable'
                ? `Servicio cerrado — Orden ${order.orderNumber}`
                : `Servicio en seguimiento — Orden ${order.orderNumber}`

          await tx.notification.create({
            data: {
              userId: order.customerId.toString(),
              userType: 'customer',
              tipo: 'system',
              canal: 'system',
              destinatario: order.email,
              asunto: clienteAsunto,
              mensaje: clienteMensaje,
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
      }

      // Historial del cambio
      await tx.orderHistory.create({
        data: {
          orderId,
          estadoAnterior: order.estado,
          estadoNuevo: newOrderState,
          changedBy: isAdmin ? 'admin' : 'technician',
          changedById: user.id.toString(),
          notas: notasHistorial,
          metadata: {
            descripcionCierre: descripcion.trim(),
            costoFinalCOP: numCostoFinal,
            tipoCierre: estadoCierre
          }
        }
      })

      return updatedOrder
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: `Servicio cerrado. Costo registrado: $${numCostoFinal.toLocaleString('es-CO')} COP`
    })

  } catch (error) {
    console.error('Error cerrando servicio:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
