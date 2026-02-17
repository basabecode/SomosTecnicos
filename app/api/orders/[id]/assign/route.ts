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
  tiempoEstimado: z.number().int().positive().optional(),
  reassign: z.boolean().optional()
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

    const { technicianId, fechaProgramada, notasAsignacion, tiempoEstimado, reassign } = validation.data

    // Usar transacción con aislamiento serializable para evitar race conditions
    const result = await prisma.$transaction(async (tx) => {
      // ✅ DENTRO DE TRANSACCIÓN: Verificar que la orden existe y buscar asignaciones activas
      const existingOrder = await tx.order.findUnique({
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
        throw new Error('ORDEN_NO_ENCONTRADA')
      }

      // Lógica de Reasignación
      let oldTechnician = null;
      if (existingOrder.assignments.length > 0) {
        if (!reassign) {
             throw new Error('ORDEN_YA_ASIGNADA')
        }

        // Procesar reasignación
        const currentAssignment = existingOrder.assignments[0];
        oldTechnician = currentAssignment.technician;

        // 1. Marcar asignación anterior como reasignada/cancelada
        await tx.assignment.update({
            where: { id: currentAssignment.id },
            data: {
                estado: 'reasignado', // O 'cancelado' si no existe el estado 'reasignado' en el enum
                updatedAt: new Date()
            }
        });

        // 2. Liberar al técnico anterior
        await tx.technician.update({
            where: { id: oldTechnician.id },
            data: {
                disponible: true,
                updatedAt: new Date()
            }
        });

        // 3. Registrar en historial
         await tx.orderHistory.create({
            data: {
              orderId,
              estadoAnterior: existingOrder.estado,
              estadoNuevo: 'asignado', // Se mantiene igual o cambia momentaneamente
              notas: `Reasignación: Técnico ${oldTechnician.nombre} removido.`,
              changedBy: 'admin',
              changedById: user.id.toString()
            }
          })
      }


      // ✅ DENTRO DE TRANSACCIÓN: Verificar que el NUEVO técnico existe y está disponible
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

      // Crear la NUEVA asignación
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
              email: true, // Asegurar que traemos email
              especialidades: true
            }
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              nombre: true,
              email: true, // Asegurar que traemos email
              direccion: true,
              tipoElectrodomestico: true,
              ciudad: true
            }
          }
        }
      })

      // Actualizar estado de la orden (confirmar asignado)
      await tx.order.update({
        where: { id: orderId },
        data: {
          estado: 'asignado',
          updatedAt: new Date()
        }
      })

      // Marcar NUEVO técnico como no disponible
      await tx.technician.update({
        where: { id: technicianId },
        data: {
          disponible: false,
          updatedAt: new Date()
        }
      })

      // Crear registro de historial para la nueva asignación
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

      return { assignment, existingOrder, technician, oldTechnician }
    }, {
      isolationLevel: 'Serializable' // Máximo nivel de aislamiento para evitar race conditions
    })

    // ✅ Notificaciones asíncronas (no bloquean la respuesta)
    try {
      // Email al NUEVO técnico con detalles de la asignación
      await enqueueEmail({
        to: result.technician.email || 'soporte@somostecnicos.com', // Fallback
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

      // Si hubo reasignación, notificar al técnico anterior (Opcional, pero recomendado)
      if (result.oldTechnician && result.oldTechnician.email) {
          await enqueueEmail({
            to: result.oldTechnician.email,
            subject: `Asignación Cancelada - Orden #${result.existingOrder.orderNumber}`,
            template: 'status-update', // Reusing status update or creating a specific one
            data: {
                orderNumber: result.existingOrder.orderNumber,
                customerName: result.existingOrder.nombre, // Not really needed for tech but template asks
                newStatus: 'reasignado (cancelado para usted)',
                notes: 'Esta orden ha sido reasignada a otro técnico.'
            }
          }, 'medium')
      }

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
        action: reassign ? 'technician_reassignment' : 'technician_assignment',
        userId: result.technician.id.toString(),
        metadata: {
          orderId: result.existingOrder.id,
          orderNumber: result.existingOrder.orderNumber,
          technicianName: result.technician.nombre,
          assignedBy: user.id.toString(),
          assignedAt: new Date().toISOString(),
          reassign: !!reassign
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
        message: reassign ? 'Técnico reasignado exitosamente' : 'Técnico asignado exitosamente',
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
                error: 'Esta orden ya tiene una asignación activa. Use la opción de reasignar.'
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
          error: 'Error interno del servidor',
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      )
    }
  }, { required: false }) // Idempotencia opcional para compatibilidad
}
