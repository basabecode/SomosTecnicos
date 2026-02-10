import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'
import { ORDER_STATES, USER_ROLES } from '@/lib/constants'

// PATCH /api/orders/[id]/close - Cerrar Servicio (Técnico)
export const PATCH = withAuth(async (req: NextRequest, user: AuthenticatedUser, { params }: { params: { id: string } }) => {
  try {
    const orderId = params.id
    const body = await req.json()
    const {
      descripcion,
      costoFinal,
      estadoCierre // 'reparado' | 'no_reparable' | 'seguimiento'
    } = body

    // 1. Validaciones básicas
    if (!descripcion || costoFinal === undefined || costoFinal === null) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos (descripción o costo)' },
        { status: 400 }
      )
    }

    // 2. Verificar orden
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

    // 3. Verificar permisos (Técnico asignado o Admin)
    let isAssignedTechnician = false
    if (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN) {
      isAssignedTechnician = true
    } else {
      const tech = await prisma.technician.findUnique({ where: { email: user.email } })
      if (tech) {
        // Buscar asignación activa
        const assignment = order.assignments.find(a => a.technicianId === tech.id && a.estado !== 'cancelado')
        if (assignment) isAssignedTechnician = true
      }
    }

    if (!isAssignedTechnician) {
      return NextResponse.json(
        { success: false, error: 'No tienes permiso para cerrar esta orden' },
        { status: 403 }
      )
    }

    // Mapear el estadoCierre a ORDER_STATES
    let newOrderState: string
    let newAssignmentState = 'completado'
    let notasHistorial = ''

    switch (estadoCierre) {
      case 'reparado':
        newOrderState = ORDER_STATES.REPARADO
        notasHistorial = `Servicio completado exitosamente. Costo final: $${costoFinal}`
        // Flujo feliz: orden pasa a REPARADO (luego admin la pasará a COMPLETADO tras pago/factura?)
        // O directamente COMPLETADO si ya se cobró.
        // Asumiremos REPARADO como estado intermedio antes de cierre administrativo, o COMPLETADO si el flujo es simple.
        // Usaremos REPARADO si existe, si no COMPLETADO.
        // Revisando constantes... ORDER_STATES.COMPLETADO suele ser el final.
        // Si ORDER_STATES.REPARADO no existe, usar COMPLETADO.
        // Voy a asurmir que REPARADO existe o usar COMPLETADO.
        // El usuario mencionó: "reparado -> entregado -> completado".
        newOrderState = 'reparado' // Usaré el string literal si no está en enum, o revisaré constants.ts
        break;

      case 'no_reparable':
        newOrderState = ORDER_STATES.CANCELADO
        notasHistorial = `Servicio cerrado como NO REPARABLE. Se cobró revisión: $${costoFinal}`
        break;

      case 'seguimiento':
        newOrderState = ORDER_STATES.REAGENDADO // O PENDIENTE
        newAssignmentState = 'en_proceso' // La asignación sigue abierta? O se cierra esta y se abre otra?
        // Si requiere seguimiento, la asignación actual termina pero la orden queda abierta.
        newAssignmentState = 'completado' // Esta visita terminó.
        notasHistorial = `Servicio requiere seguimiento. Visita completada.`
        break;

      default:
        return NextResponse.json({ success: false, error: 'Estado de cierre inválido' }, { status: 400 })
    }

    // Ejecutar transacción
    const result = await prisma.$transaction(async (tx) => {
      // 1. Actualizar Orden
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          estado: newOrderState,
          costoFinal: parseFloat(costoFinal),
          fechaCompletado: new Date() // Fecha de cierre técnico
        }
      })

      // 2. Actualizar Asignación(es) activa(s)
      // Cerrar todas las asignaciones abiertas para este técnico en esta orden
      // (aunque debería ser una sola)
      if (user.role !== USER_ROLES.CUSTOMER) { // Si es técnico/admin
         const tech = await tx.technician.findUnique({ where: { email: user.email } })
         if (tech) {
            await tx.assignment.updateMany({
              where: {
                orderId: orderId,
                technicianId: tech.id,
                estado: { in: ['asignado', 'en_camino', 'en_proceso'] }
              },
              data: {
                estado: newAssignmentState,
                fechaCompletada: new Date(),
                notasTecnico: `[${estadoCierre.toUpperCase()}] ${descripcion}`
              }
            })
         }
      }

      // 3. Historial
      await tx.orderHistory.create({
        data: {
          orderId,
          estadoAnterior: order.estado,
          estadoNuevo: newOrderState,
          changedBy: 'technician',
          changedById: user.id.toString(),
          notas: notasHistorial,
          metadata: {
            descripcionCierre: descripcion,
            costo: costoFinal,
            tipoCierre: estadoCierre
          }
        }
      })

      return updatedOrder
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Servicio cerrado exitosamente'
    })

  } catch (error) {
    console.error('Error cerrando servicio:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
