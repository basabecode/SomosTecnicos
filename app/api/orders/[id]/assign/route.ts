/**
 * API para asignar técnico a una orden específica
 * POST /api/orders/[id]/assign - Asignar técnico a orden
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTechnicianManager } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { withIdempotency } from '@/lib/idempotency'
import { enqueueEmail, enqueueNotification, enqueueAudit } from '@/lib/queue'
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

    // Usar transacción con aislamiento serializable para evitar race conditions
    const result = await prisma.$transaction(async (tx) => {
      // ✅ DENTRO DE TRANSACCIÓN: Verificar que la orden existe y no está asignada
      const existingOrder = await tx.order.findUnique({
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
        throw new Error('ORDEN_NO_ENCONTRADA')
      }

      // Verificar que la orden no esté ya asignada (protegido por transacción)
      if (existingOrder.assignments.length > 0) {
        throw new Error('ORDEN_YA_ASIGNADA')
      }

      // ✅ DENTRO DE TRANSACCIÓN: Verificar que el técnico existe y está disponible
      const technician = await tx.technician.findUnique({
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
        throw new Error('TECNICO_NO_ENCONTRADO')
      }

      if (!technician.activo) {
        throw new Error('TECNICO_NO_ACTIVO')
      }

      // Verificar que el técnico no tenga asignaciones activas (protegido por transacción)
      if (technician.assignments.length > 0) {
        throw new Error('TECNICO_YA_ASIGNADO')
      }
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

      return { assignment, existingOrder, technician }
    }, {
      isolationLevel: 'Serializable' // Máximo nivel de aislamiento para evitar race conditions
    })

    // ✅ Notificaciones asíncronas (no bloquean la respuesta)
    try {
      // Email al técnico con detalles de la asignación
      await enqueueEmail({
        to: result.technician.email || `${result.technician.telefono}@sms.provider.com`, // Fallback a SMS
        subject: `Nueva Asignación - Orden #${result.existingOrder.orderNumber}`,
        template: 'technician-assignment',
        data: {
          technicianName: result.technician.nombre,
          orderNumber: result.existingOrder.orderNumber,
          customerName: result.existingOrder.nombre,
          address: `${result.existingOrder.direccion}, ${result.existingOrder.ciudad}`,
          appliance: result.existingOrder.tipoElectrodomestico,
          scheduledDate: result.assignment.fechaProgramada,
          notes: result.assignment.notasAsignacion
        }
      }, 'high')

      // Notificación in-app al técnico
      await enqueueNotification({
        userId: result.technician.id.toString(),
        title: 'Nueva Asignación de Trabajo',
        message: `Se te ha asignado la orden #${result.existingOrder.orderNumber} para ${result.existingOrder.tipoElectrodomestico}`,
        type_notification: 'assignment'
      }, 'high')

      // Email al cliente informando la asignación
      await enqueueEmail({
        to: result.existingOrder.email,
        subject: `Técnico Asignado - Orden #${result.existingOrder.orderNumber}`,
        template: 'customer-technician-assigned',
        data: {
          customerName: result.existingOrder.nombre,
          orderNumber: result.existingOrder.orderNumber,
          technicianName: result.technician.nombre,
          technicianPhone: result.technician.telefono,
          scheduledDate: result.assignment.fechaProgramada,
          appliance: result.existingOrder.tipoElectrodomestico
        }
      }, 'medium')

      // Audit log asíncrono
      await enqueueAudit({
        action: 'technician_assignment',
        userId: result.technician.id.toString(),
        metadata: {
          orderId: result.existingOrder.id,
          orderNumber: result.existingOrder.orderNumber,
          technicianName: result.technician.nombre,
          assignedBy: user.id.toString(),
          assignedAt: new Date().toISOString()
        }
      }, 'low')

    } catch (queueError) {
      // Log error pero no fallar la respuesta (notificaciones son best-effort)
      logger.error('Error encolando notificaciones de asignación:', queueError as Error, {
        component: 'technician-assignment-queue',
        metadata: {
          technicianId: result.technician.id,
          orderId: result.existingOrder.id,
          orderNumber: result.existingOrder.orderNumber
        }
      })
    }

      return NextResponse.json({
        success: true,
        message: 'Técnico asignado exitosamente',
        data: result.assignment
      })

    } catch (error) {
      console.error('Error asignando técnico:', error)
      
      // Manejo específico de errores de race conditions
      if (error instanceof Error) {
        switch (error.message) {
          case 'ORDEN_NO_ENCONTRADA':
            return NextResponse.json(
              {
                success: false,
                error: 'Orden no encontrada'
              },
              { status: 404 }
            )
          case 'ORDEN_YA_ASIGNADA':
            return NextResponse.json(
              {
                success: false,
                error: 'Esta orden ya tiene una asignación activa'
              },
              { status: 409 }
            )
          case 'TECNICO_NO_ENCONTRADO':
            return NextResponse.json(
              {
                success: false,
                error: 'Técnico no encontrado'
              },
              { status: 404 }
            )
          case 'TECNICO_NO_ACTIVO':
            return NextResponse.json(
              {
                success: false,
                error: 'El técnico no está activo'
              },
              { status: 409 }
            )
          case 'TECNICO_YA_ASIGNADO':
            return NextResponse.json(
              {
                success: false,
                error: 'El técnico ya tiene una asignación activa'
              },
              { status: 409 }
            )
        }
      }
      
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
