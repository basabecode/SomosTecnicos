import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'
import { ORDER_STATES, VISIT_RESULTS, USER_ROLES } from '@/lib/constants'

// POST /api/orders/[id]/visit-report - Crear Informe de Visita
export const POST = withAuth(async (req: NextRequest, user: AuthenticatedUser, { params }: { params: { id: string } }) => {
  try {
    const orderId = params.id
    const body = await req.json()
    const {
      assignmentId,
      diagnostico,
      resultado,
      costoVisita,
      costoReparacion,
      costoRepuestos,
      repuestos,
      notasAdicionales,
      recomendaciones,
    } = body

    // 1. Validaciones basicas
    if (!diagnostico || diagnostico.length < 20) {
      return NextResponse.json(
        { success: false, error: 'El diagnóstico debe tener al menos 20 caracteres' },
        { status: 400 }
      )
    }

    const validResults = Object.values(VISIT_RESULTS)
    if (!resultado || !validResults.includes(resultado)) {
      return NextResponse.json(
        { success: false, error: `Resultado inválido. Valores permitidos: ${validResults.join(', ')}` },
        { status: 400 }
      )
    }

    if (costoVisita === undefined || costoVisita === null || costoVisita < 0) {
      return NextResponse.json(
        { success: false, error: 'El costo de visita es requerido' },
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

    // Verificar que la orden esta en un estado valido para recibir informe
    const validStates = [ORDER_STATES.EN_CAMINO, ORDER_STATES.EN_PROCESO, ORDER_STATES.ASIGNADO]
    if (!validStates.includes(order.estado as any)) {
      return NextResponse.json(
        { success: false, error: `La orden no está en un estado válido para informe de visita (estado actual: ${order.estado})` },
        { status: 400 }
      )
    }

    // 3. Verificar permisos (Tecnico asignado o Admin)
    let technicianId: number | null = null
    const isAdmin = user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN

    if (isAdmin) {
      // Admin puede enviar informe, usar el tecnico de la asignacion
      const assignment = order.assignments.find(a => a.id === assignmentId && a.estado !== 'cancelado')
      if (assignment) technicianId = assignment.technicianId
    } else {
      const tech = await prisma.technician.findUnique({ where: { email: user.email } })
      if (tech) {
        const assignment = order.assignments.find(a => a.technicianId === tech.id && a.estado !== 'cancelado')
        if (assignment) technicianId = tech.id
      }
    }

    if (!technicianId) {
      return NextResponse.json(
        { success: false, error: 'No tienes permiso para enviar informe en esta orden' },
        { status: 403 }
      )
    }

    // Obtener la asignacion activa
    const activeAssignment = order.assignments.find(a =>
      a.technicianId === technicianId && a.estado !== 'cancelado' && a.estado !== 'completado'
    )

    if (!activeAssignment) {
      return NextResponse.json(
        { success: false, error: 'No se encontró asignación activa para esta orden' },
        { status: 400 }
      )
    }

    // 4. Calcular costo total
    const numCostoVisita = parseFloat(costoVisita) || 0
    const numCostoReparacion = parseFloat(costoReparacion) || 0
    const numCostoRepuestos = parseFloat(costoRepuestos) || 0
    const costoTotal = numCostoVisita + numCostoReparacion + numCostoRepuestos

    // 5. Determinar nuevos estados segun resultado
    let newOrderState: string
    let newAssignmentState: string = activeAssignment.estado
    let completarAsignacion = false
    let notasHistorial = ''

    switch (resultado) {
      case VISIT_RESULTS.REVISADO:
        newOrderState = ORDER_STATES.REVISADO
        notasHistorial = `Revisión completada. Diagnóstico: ${diagnostico.substring(0, 100)}...`
        break

      case VISIT_RESULTS.REPARADO:
        newOrderState = ORDER_STATES.REPARADO
        completarAsignacion = true
        notasHistorial = `Reparado en sitio. Costo total: $${costoTotal.toLocaleString('es-CO')}`
        break

      case VISIT_RESULTS.PENDIENTE_REPUESTO:
        newOrderState = ORDER_STATES.ESPERANDO_REPUESTOS
        notasHistorial = `Requiere repuestos. Detalle: ${repuestos ? JSON.stringify(repuestos) : 'N/A'}`
        break

      case VISIT_RESULTS.NO_REPARABLE:
        newOrderState = ORDER_STATES.CANCELADO
        completarAsignacion = true
        notasHistorial = `No reparable. Se cobra visita: $${numCostoVisita.toLocaleString('es-CO')}`
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Resultado no válido' },
          { status: 400 }
        )
    }

    // 6. Ejecutar transaccion
    const result = await prisma.$transaction(async (tx) => {
      // Crear VisitReport
      const visitReport = await tx.visitReport.create({
        data: {
          assignmentId: activeAssignment.id,
          orderId,
          technicianId,
          diagnostico,
          resultado,
          costoVisita: numCostoVisita,
          costoReparacion: numCostoReparacion > 0 ? numCostoReparacion : null,
          costoRepuestos: numCostoRepuestos > 0 ? numCostoRepuestos : null,
          costoTotal,
          repuestos: repuestos || null,
          notasAdicionales: notasAdicionales || null,
          recomendaciones: recomendaciones || null,
        }
      })

      // Actualizar Orden
      const orderUpdateData: any = {
        estado: newOrderState,
      }
      if (resultado === VISIT_RESULTS.REPARADO) {
        orderUpdateData.costoFinal = costoTotal
        orderUpdateData.fechaCompletado = new Date()
      } else if (resultado === VISIT_RESULTS.NO_REPARABLE) {
        orderUpdateData.costoFinal = numCostoVisita
        orderUpdateData.fechaCompletado = new Date()
      } else if (resultado === VISIT_RESULTS.REVISADO) {
        orderUpdateData.costoEstimado = costoTotal
      }

      await tx.order.update({
        where: { id: orderId },
        data: orderUpdateData,
      })

      // Actualizar Asignacion
      const assignmentUpdateData: any = {
        notasTecnico: `[${resultado.toUpperCase()}] ${diagnostico}`,
        costoManoObra: numCostoReparacion > 0 ? numCostoReparacion : undefined,
        costoRepuestos: numCostoRepuestos > 0 ? numCostoRepuestos : undefined,
      }
      if (completarAsignacion) {
        assignmentUpdateData.estado = 'completado'
        assignmentUpdateData.fechaCompletada = new Date()
        if (activeAssignment.fechaInicio) {
          assignmentUpdateData.tiempoReal = Math.floor(
            (Date.now() - activeAssignment.fechaInicio.getTime()) / 60000
          )
        }
      }

      await tx.assignment.update({
        where: { id: activeAssignment.id },
        data: assignmentUpdateData,
      })

      // Si se completa la asignacion, liberar al tecnico
      if (completarAsignacion) {
        const otherActive = await tx.assignment.count({
          where: {
            technicianId,
            estado: { in: ['asignado', 'en_camino', 'en_proceso'] },
            id: { not: activeAssignment.id }
          }
        })
        if (otherActive === 0) {
          await tx.technician.update({
            where: { id: technicianId },
            data: { disponible: true, estadoActual: 'disponible' }
          })
        }
      }

      // Crear historial
      await tx.orderHistory.create({
        data: {
          orderId,
          estadoAnterior: order.estado,
          estadoNuevo: newOrderState,
          changedBy: 'technician',
          changedById: String(technicianId),
          notas: notasHistorial,
          razon: 'Informe de visita técnica',
          metadata: {
            visitReportId: visitReport.id,
            resultado,
            costoVisita: numCostoVisita,
            costoReparacion: numCostoReparacion,
            costoRepuestos: numCostoRepuestos,
            costoTotal,
          }
        }
      })

      // Crear notificacion al cliente
      if (order.email) {
        await tx.notification.create({
          data: {
            orderId,
            userId: order.customerId ? String(order.customerId) : order.email,
            userType: 'customer',
            tipo: 'system',
            canal: 'system',
            destinatario: order.email,
            asunto: `Informe de visita - ${order.orderNumber}`,
            mensaje: resultado === VISIT_RESULTS.REPARADO
              ? `Tu equipo ha sido reparado exitosamente. Costo total: $${costoTotal.toLocaleString('es-CO')}`
              : resultado === VISIT_RESULTS.NO_REPARABLE
                ? `Lamentablemente tu equipo no tiene reparación. Se cobró la visita técnica: $${numCostoVisita.toLocaleString('es-CO')}`
                : resultado === VISIT_RESULTS.PENDIENTE_REPUESTO
                  ? `Tu equipo necesita repuestos para la reparación. Te contactaremos con los detalles.`
                  : `El técnico ha completado la revisión de tu equipo. Diagnóstico disponible en tu panel.`,
            metadata: { link: `/customer/dashboard` },
            enviado: true,
            fechaEnvio: new Date(),
          }
        })
      }

      return visitReport
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Informe de visita creado exitosamente'
    })

  } catch (error) {
    console.error('Error creando informe de visita:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})

// GET /api/orders/[id]/visit-report - Obtener informes de visita
export const GET = withAuth(async (req: NextRequest, user: AuthenticatedUser, { params }: { params: { id: string } }) => {
  try {
    const orderId = params.id

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, customerId: true, email: true }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    // Verificar permisos
    const isAdmin = user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN
    const isCustomer = user.userType === 'customer' && order.customerId === user.id
    let isTechnician = false

    if (!isAdmin && !isCustomer) {
      const tech = await prisma.technician.findUnique({ where: { email: user.email } })
      if (tech) {
        const hasAssignment = await prisma.assignment.findFirst({
          where: { orderId, technicianId: tech.id }
        })
        if (hasAssignment) isTechnician = true
      }
    }

    if (!isAdmin && !isCustomer && !isTechnician) {
      return NextResponse.json(
        { success: false, error: 'No tienes acceso a esta orden' },
        { status: 403 }
      )
    }

    const visitReports = await prisma.visitReport.findMany({
      where: { orderId },
      include: {
        technician: {
          select: { id: true, nombre: true, telefono: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: visitReports
    })

  } catch (error) {
    console.error('Error obteniendo informes de visita:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
