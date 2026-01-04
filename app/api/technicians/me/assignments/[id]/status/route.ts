import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { USER_ROLES } from '@/lib/constants'

// PATCH /api/technicians/me/assignments/[id]/status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assignmentId = parseInt(params.id)
    if (isNaN(assignmentId)) {
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    // 1. Autenticar
    const authResult = await authenticateRequest(request)
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { user } = authResult
    const body = await request.json()
    const { status } = body

    if (!status) {
        return NextResponse.json({ error: 'Estado requerido' }, { status: 400 })
    }

    // 2. Verificar que el técnico existe
    const technician = await prisma.technician.findUnique({
      where: { email: user.email }
    })

    if (!technician) {
      return NextResponse.json({ error: 'Perfil técnico no encontrado' }, { status: 404 })
    }

    // 3. Verificar que la asignación pertenece al técnico
    const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: { order: true }
    })

    if (!assignment) {
        return NextResponse.json({ error: 'Asignación no encontrada' }, { status: 404 })
    }

    if (assignment.technicianId !== technician.id) {
        return NextResponse.json({ error: 'No tienes permiso sobre esta asignación' }, { status: 403 })
    }

    // 4. Actualizar estados (Transacción)
    // Mapeo de estados de asignación a estados de orden
    // Asignación: asignado -> en_proceso -> completado
    // Orden: asignado -> en_proceso -> completado

    // Validar transición lógica básica
    // (Se podría hacer una máquina de estados más estricta aquí)

    const result = await prisma.$transaction(async (tx) => {
        // Actualizar Asignación
        const updatedAssignment = await tx.assignment.update({
            where: { id: assignmentId },
            data: {
                estado: status,
                fechaInicio: status === 'en_proceso' ? new Date() : assignment.fechaInicio,
                fechaCompletada: status === 'completado' ? new Date() : assignment.fechaCompletada,
                tiempoReal: status === 'completado' && assignment.fechaInicio
                    ? Math.floor((Date.now() - assignment.fechaInicio.getTime()) / 60000) // min
                    : undefined
            }
        })

        // Actualizar Orden
        const updatedOrder = await tx.order.update({
            where: { id: assignment.orderId },
            data: {
                estado: status
            }
        })

        // Crear Historial
        await tx.orderHistory.create({
            data: {
                orderId: assignment.orderId,
                estadoAnterior: assignment.estado,
                estadoNuevo: status,
                changedBy: 'technician',
                changedById: String(technician.id),
                notas: `El técnico cambió el estado a ${status}`,
                razon: 'Actualización operativa'
            }
        })

        return updatedAssignment
    })

    return NextResponse.json({
        success: true,
        data: result
    })

  } catch (error) {
    console.error('Error updating assignment status:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno al actualizar estado' },
      { status: 500 }
    )
  }
}
