/**
 * API para asignar técnico a una orden específica
 * POST /api/orders/[id]/assign - Asignar técnico a orden
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTechnicianManager } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { withIdempotency } from '@/lib/idempotency'
import { z } from 'zod'

// Schema de validación para asignación
const assignTechnicianSchema = z.object({
  technicianId: z.number().int().positive('ID de técnico inválido'),
  fechaProgramada: z.string().datetime().optional(),
  notasAsignacion: z.string().max(500).optional(),
  tiempoEstimado: z.number().int().positive().optional()
})

// =============================================
// POST /api/orders/[id]/assign - Asignar técnico
// =============================================

export async function POST(
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

  // Envolver con idempotencia para prevenir asignaciones duplicadas
  return withIdempotency(request, async (req) => {
    try {
      const { id: orderId } = await params
      const body = await req.json()

    // Validar datos de entrada
    const validation = assignTechnicianSchema.safeParse(body)
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

    const { technicianId, fechaProgramada, notasAsignacion, tiempoEstimado } = validation.data

    // Verificar que la orden existe
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        assignments: {
          where: {
            estado: { in: ['asignado', 'en_proceso'] }
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

    // Verificar que la orden no esté ya asignada
    if (existingOrder.assignments.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Esta orden ya tiene una asignación activa'
        },
        { status: 409 }
      )
    }

    // Verificar que el técnico existe y está disponible
    const technician = await prisma.technician.findUnique({
      where: { id: technicianId },
      include: {
        assignments: {
          where: {
            estado: { in: ['asignado', 'en_proceso'] }
          }
        }
      }
    })

    if (!technician) {
      return NextResponse.json(
        {
          success: false,
          error: 'Técnico no encontrado'
        },
        { status: 404 }
      )
    }

    if (!technician.activo) {
      return NextResponse.json(
        {
          success: false,
          error: 'El técnico no está activo'
        },
        { status: 409 }
      )
    }

    if (technician.assignments.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'El técnico ya tiene una asignación activa'
        },
        { status: 409 }
      )
    }

    // Usar transacción para asignar
    const result = await prisma.$transaction(async (tx) => {
      // Crear la asignación
      const assignment = await tx.assignment.create({
        data: {
          orderId,
          technicianId,
          estado: 'asignado',
          fechaAsignacion: new Date(),
          fechaProgramada: fechaProgramada ? new Date(fechaProgramada) : null,
          notasAsignacion,
          tiempoEstimado,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        include: {
          technician: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              especialidades: true
            }
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              nombre: true,
              tipoElectrodomestico: true,
              ciudad: true
            }
          }
        }
      })

      // Actualizar estado de la orden
      await tx.order.update({
        where: { id: orderId },
        data: {
          estado: 'asignado',
          updatedAt: new Date()
        }
      })

      // Marcar técnico como no disponible
      await tx.technician.update({
        where: { id: technicianId },
        data: {
          disponible: false,
          updatedAt: new Date()
        }
      })

      // Crear registro de historial
      await tx.orderHistory.create({
        data: {
          orderId,
          estadoAnterior: existingOrder.estado,
          estadoNuevo: 'asignado',
          notas: `Asignado a técnico: ${technician.nombre}. ${notasAsignacion || ''}`,
          changedBy: 'admin',
          changedById: user.id.toString()
        }
      })

      return assignment
    })

    // Aquí se puede agregar notificación por email/SMS al técnico
    try {
      // TODO: Implementar notificación al técnico
      logger.audit('technician_assignment', technician.id.toString(), {
        orderId: existingOrder.id,
        orderNumber: existingOrder.orderNumber,
        technicianName: technician.nombre,
        action: 'technician_assigned'
      })
    } catch (notificationError) {
      logger.error('Error enviando notificación de asignación', notificationError as Error, {
        component: 'technician-assignment',
        metadata: {
          technicianId: technician.id,
          orderId: existingOrder.id,
          orderNumber: existingOrder.orderNumber
        }
      })
    }

      return NextResponse.json({
        success: true,
        message: 'Técnico asignado exitosamente',
        data: result
      })

    } catch (error) {
      console.error('Error asignando técnico:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Error interno del servidor'
        },
        { status: 500 }
      )
    }
  }, { required: false }) // Idempotencia opcional para compatibilidad
}
