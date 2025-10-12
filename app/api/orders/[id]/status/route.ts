/**
 * API para cambiar estado de orden
 * PUT /api/orders/[id]/status - Cambiar estado de orden
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTechnicianManager } from '@/lib/auth'
import { ORDER_STATES } from '@/lib/constants'
import { logger } from '@/lib/logger'
import { z } from 'zod'

// Schema de validación para cambio de estado
const changeStatusSchema = z.object({
  estado: z.enum(Object.values(ORDER_STATES) as [string, ...string[]]),
  notas: z.string().max(500).optional(),
  costoFinal: z.number().positive().optional(),
  tiempoReal: z.number().int().positive().optional()
})

// =============================================
// PUT /api/orders/[id]/status - Cambiar estado
// =============================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar permisos de administrador
  const authCheck = await requireTechnicianManager(request)
  if (!authCheck.authorized || !authCheck.user) {
    return NextResponse.json(
      {
        success: false,
        error: authCheck.error || 'No autorizado'
      },
      { status: 401 }
    )
  }

  const user = authCheck.user

  try {
    const { id: orderId } = await params
    const body = await request.json()

    // Validar datos de entrada
    const validation = changeStatusSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: validation.error.errors
        },
        { status: 400 }
      )
    }

    const { estado: nuevoEstado, notas, costoFinal, tiempoReal } = validation.data

    // Verificar que la orden existe
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        assignments: {
          where: {
            estado: { in: ['asignado', 'en_proceso'] }
          },
          include: {
            technician: true
          }
        }
      }
    })

    if (!existingOrder) {
      return NextResponse.json(
        {
          success: false,
          error: 'Orden no encontrada'
        },
        { status: 404 }
      )
    }

    // Validar transiciones de estado válidas
    const validTransitions: Record<string, string[]> = {
      [ORDER_STATES.PENDIENTE]: [ORDER_STATES.ASIGNADO, ORDER_STATES.CANCELADO],
      [ORDER_STATES.ASIGNADO]: [ORDER_STATES.EN_PROCESO, ORDER_STATES.CANCELADO],
      [ORDER_STATES.EN_PROCESO]: [ORDER_STATES.COMPLETADO, ORDER_STATES.CANCELADO],
      [ORDER_STATES.COMPLETADO]: [], // Final state
      [ORDER_STATES.CANCELADO]: [] // Final state
    }

    const allowedNextStates = validTransitions[existingOrder.estado] || []
    if (!allowedNextStates.includes(nuevoEstado)) {
      return NextResponse.json(
        {
          success: false,
          error: `No se puede cambiar de estado "${existingOrder.estado}" a "${nuevoEstado}"`
        },
        { status: 400 }
      )
    }

    // Usar transacción para cambiar estado
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar orden
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          estado: nuevoEstado,
          costoFinal: costoFinal || existingOrder.costoFinal,
          fechaCompletado: nuevoEstado === ORDER_STATES.COMPLETADO ? new Date() : null,
          updatedAt: new Date()
        },
        include: {
          assignments: {
            include: {
              technician: {
                select: {
                  id: true,
                  nombre: true,
                  telefono: true
                }
              }
            }
          }
        }
      })

      // Actualizar asignación si existe
      if (existingOrder.assignments.length > 0) {
        const assignment = existingOrder.assignments[0]

        let assignmentStatus = 'asignado'
        if (nuevoEstado === ORDER_STATES.EN_PROCESO) {
          assignmentStatus = 'en_proceso'
        } else if (nuevoEstado === ORDER_STATES.COMPLETADO) {
          assignmentStatus = 'completado'
        } else if (nuevoEstado === ORDER_STATES.CANCELADO) {
          assignmentStatus = 'cancelado'
        }

        await tx.assignment.update({
          where: { id: assignment.id },
          data: {
            estado: assignmentStatus,
            tiempoReal: tiempoReal || assignment.tiempoReal,
            updatedAt: new Date()
          }
        })

        // Si se completa o cancela, liberar técnico
        if (nuevoEstado === ORDER_STATES.COMPLETADO || nuevoEstado === ORDER_STATES.CANCELADO) {
          await tx.technician.update({
            where: { id: assignment.technicianId },
            data: {
              disponible: true,
              updatedAt: new Date()
            }
          })

          // Si se completa, actualizar estadísticas del técnico
          if (nuevoEstado === ORDER_STATES.COMPLETADO) {
            const completedCount = await tx.assignment.count({
              where: {
                technicianId: assignment.technicianId,
                estado: 'completado'
              }
            })

            await tx.technician.update({
              where: { id: assignment.technicianId },
              data: {
                ordenesCompletadas: completedCount
              }
            })
          }
        }
      }

      // Crear registro de historial
      await tx.orderHistory.create({
        data: {
          orderId,
          estadoAnterior: existingOrder.estado,
          estadoNuevo: nuevoEstado,
          notas: notas || `Estado cambiado por ${user.nombre}`,
          changedBy: 'admin',
          changedById: user.id.toString()
        }
      })

      return updatedOrder
    })

    // Notificación al cliente (opcional)
    try {
      if (nuevoEstado === ORDER_STATES.ASIGNADO || nuevoEstado === ORDER_STATES.EN_PROCESO || nuevoEstado === ORDER_STATES.COMPLETADO) {
        // TODO: Implementar notificación al cliente
        logger.audit('order_status_notification_pending', 'system', {
          orderId: existingOrder.id,
          newStatus: nuevoEstado,
          action: 'status_change_notification'
        })
      }
    } catch (notificationError) {
      logger.error('Error enviando notificación de estado', notificationError as Error, {
        component: 'order-status',
        metadata: { orderId: existingOrder.id, newStatus: nuevoEstado }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Estado de orden actualizado exitosamente',
      data: result
    })

  } catch (error) {
    console.error('Error cambiando estado de orden:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}
