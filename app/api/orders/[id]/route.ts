/**
 * API para orden específica por ID
 * GET, PUT, DELETE para una orden individual
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, requireTechnicianManager, AuthenticatedUser } from '@/lib/auth'
import { validateAndTransform, updateOrderSchema } from '@/lib/validations'
import { ORDER_STATES } from '@/lib/constants'

// =============================================
// GET /api/orders/[id] - Obtener orden por ID
// =============================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      const { id } = await params

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          assignments: {
            include: {
              technician: {
                select: {
                  id: true,
                  nombre: true,
                  telefono: true,
                  especialidades: true,
                  calificacionPromedio: true
                }
              }
            }
          },
          history: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })

      if (!order) {
        return NextResponse.json(
          {
            success: false,
            error: 'Orden no encontrada'
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: order
      })

    } catch (error) {
      console.error('Error obteniendo orden:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Error interno del servidor'
        },
        { status: 500 }
      )
    }
  })(request)
}

// =============================================
// PUT /api/orders/[id] - Actualizar orden
// =============================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      const { id } = await params
      const body = await req.json()

      // Validar datos de entrada
      const validation = validateAndTransform(updateOrderSchema, { ...body, id })
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: 'Datos inválidos',
            details: validation.errors.errors
          },
          { status: 400 }
        )
      }

      const { id: orderId, ...updateData } = validation.data

      // Verificar que la orden existe
      const existingOrder = await prisma.order.findUnique({
        where: { id }
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

      // Actualizar orden
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          ...updateData,
          fechaPreferida: updateData.fechaPreferida
            ? new Date(updateData.fechaPreferida)
            : undefined,
          updatedAt: new Date()
        },
        include: {
          assignments: {
            include: {
              technician: {
                select: {
                  id: true,
                  nombre: true,
                  telefono: true,
                  especialidades: true
                }
              }
            }
          }
        }
      })

      // Si cambió el estado, crear registro de historial
      if (updateData.estado && updateData.estado !== existingOrder.estado) {
        await prisma.orderHistory.create({
          data: {
            orderId: id,
            estadoAnterior: existingOrder.estado,
            estadoNuevo: updateData.estado,
            notas: `Estado actualizado por ${user.nombre}`,
            changedBy: 'admin',
            changedById: user.id.toString()
          }
        })

        // Enviar notificación al cliente sobre cambio de estado
        try {
          const { sendStatusUpdateEmail } = await import('@/lib/email')
          await sendStatusUpdateEmail({
            orderNumber: updatedOrder.orderNumber,
            customerName: updatedOrder.nombre,
            customerEmail: updatedOrder.email,
            customerPhone: updatedOrder.telefono,
            serviceType: updatedOrder.tipoServicio,
            applianceType: updatedOrder.tipoElectrodomestico,
            description: updatedOrder.descripcionProblema || '',
            address: updatedOrder.direccion,
            preferredDate: updatedOrder.fechaPreferida?.toLocaleDateString('es-CO') || 'Sin fecha específica',
            status: updateData.estado,
            technicianName: updatedOrder.assignments?.[0]?.technician?.nombre,
            technicianPhone: updatedOrder.assignments?.[0]?.technician?.telefono,
            notes: `Estado actualizado por ${user.nombre}`
          })
        } catch (emailError) {
          console.error('Error enviando email de actualización:', emailError)
          // No fallar la actualización por error de email
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Orden actualizada exitosamente',
        data: updatedOrder
      })

    } catch (error) {
      console.error('Error actualizando orden:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Error interno del servidor'
        },
        { status: 500 }
      )
    }
  })(request)
}

// =============================================
// DELETE /api/orders/[id] - Eliminar orden
// =============================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar autenticación y permisos manualmente
  const authCheck = await requireTechnicianManager(request)

  if (!authCheck.authorized || !authCheck.user) {
    if (authCheck.error?.includes('No tienes permisos')) {
      return NextResponse.json(
        {
          success: false,
          error: authCheck.error
        },
        { status: 403 }
      )
    }
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
    const { id } = await params

    // Verificar que la orden existe y no está completada
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        assignments: true,
        history: true
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

    // No permitir eliminar órdenes completadas
    if (existingOrder.estado === ORDER_STATES.COMPLETADO) {
      return NextResponse.json(
        {
          success: false,
          error: 'No se puede eliminar una orden completada'
        },
        { status: 400 }
      )
    }

    // Eliminar en transacción para mantener consistencia
  await prisma.$transaction(async tx => {
      // Eliminar historial
      await tx.orderHistory.deleteMany({
        where: { orderId: id }
      })

      // Eliminar asignaciones si existen
      if (existingOrder.assignments && existingOrder.assignments.length > 0) {
        await tx.assignment.deleteMany({
          where: { orderId: id }
        })
      }

      // Eliminar orden
      await tx.order.delete({
        where: { id }
      })
    })

    // Crear registro de auditoría
    await prisma.orderHistory.create({
      data: {
        orderId: id,
        estadoAnterior: existingOrder.estado,
        estadoNuevo: ORDER_STATES.CANCELADO,
        notas: `Orden eliminada por ${user.nombre}`,
        changedBy: 'admin',
        changedById: user.id.toString()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Orden eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error eliminando orden:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}
