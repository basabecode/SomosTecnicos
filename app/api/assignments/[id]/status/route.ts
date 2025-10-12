import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'
import { z } from 'zod'

/**
 * API para actualizar estado de asignación específica
 * PUT /api/assignments/[id]/status
 */

const updateStatusSchema = z.object({
  estado: z.enum(['asignado', 'en_camino', 'en_proceso', 'completado', 'cancelado'])
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      const { id } = await params
      const assignmentId = parseInt(id)

      if (isNaN(assignmentId)) {
        return NextResponse.json(
          { error: 'ID de asignación inválido' },
          { status: 400 }
        )
      }

      const body = await request.json()
      const validation = updateStatusSchema.safeParse(body)

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Estado inválido', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { estado } = validation.data

      // Verificar que la asignación existe
      const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: {
          order: true,
          technician: true
        }
      })

      if (!assignment) {
        return NextResponse.json(
          { error: 'Asignación no encontrada' },
          { status: 404 }
        )
      }

      // Verificar permisos: solo el técnico asignado o administradores pueden actualizar
      if (user.role !== 'admin' && user.role !== 'manager' && user.id !== assignment.technicianId) {
        return NextResponse.json(
          { error: 'No tienes permisos para actualizar esta asignación' },
          { status: 403 }
        )
      }

      // Validar transiciones de estado
      const validTransitions: Record<string, string[]> = {
        'asignado': ['en_camino', 'cancelado'],
        'en_camino': ['en_proceso', 'cancelado'],
        'en_proceso': ['completado', 'cancelado'],
        'completado': [],
        'cancelado': []
      }

      const allowedStates = validTransitions[assignment.estado] || []
      if (!allowedStates.includes(estado) && user.role !== 'admin') {
        return NextResponse.json(
          { error: `No se puede cambiar de ${assignment.estado} a ${estado}` },
          { status: 400 }
        )
      }

      // Actualizar asignación usando transacción
      const result = await prisma.$transaction(async (tx) => {
        // Actualizar la asignación
        const updatedAssignment = await tx.assignment.update({
          where: { id: assignmentId },
          data: {
            estado: estado,
            fechaInicio: estado === 'en_proceso' ? new Date() : assignment.fechaInicio,
            fechaCompletada: estado === 'completado' ? new Date() : assignment.fechaCompletada,
            updatedAt: new Date()
          }
        })

        // Actualizar el estado de la orden relacionada
        let orderStatus = assignment.order.estado
        if (estado === 'en_proceso') {
          orderStatus = 'en_proceso'
        } else if (estado === 'completado') {
          orderStatus = 'completada'
        } else if (estado === 'cancelado') {
          orderStatus = 'cancelada'
        }

        await tx.order.update({
          where: { id: assignment.orderId },
          data: {
            estado: orderStatus,
            fechaCompletado: estado === 'completado' ? new Date() : assignment.order.fechaCompletado,
            updatedAt: new Date()
          }
        })

        // Actualizar disponibilidad del técnico si es necesario
        if (estado === 'completado' || estado === 'cancelado') {
          // Verificar si tiene otras asignaciones activas
          const activeAssignments = await tx.assignment.count({
            where: {
              technicianId: assignment.technicianId,
              estado: {
                in: ['asignado', 'en_camino', 'en_proceso']
              },
              id: {
                not: assignmentId
              }
            }
          })

          // Si no tiene más asignaciones activas, marcar como disponible
          if (activeAssignments === 0) {
            await tx.technician.update({
              where: { id: assignment.technicianId },
              data: {
                disponible: true,
                ultimaActividad: new Date()
              }
            })
          }
        }

        // Crear registro en el historial
        await tx.orderHistory.create({
          data: {
            orderId: assignment.orderId,
            estadoAnterior: assignment.estado,
            estadoNuevo: estado,
            changedBy: user.role === 'admin' || user.role === 'manager' ? 'admin' : 'technician',
            changedById: user.id.toString(),
            notas: `Estado de asignación actualizado por ${user.nombre}`,
            createdAt: new Date()
          }
        })

        return updatedAssignment
      })

      return NextResponse.json({
        success: true,
        message: 'Estado de asignación actualizado exitosamente',
        data: result
      })

    } catch (error) {
      console.error('Error actualizando estado de asignación:', error)
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }
  })(request)
}
