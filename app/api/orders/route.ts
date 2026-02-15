/**
 * API de Órdenes de Servicio
 * CRUD completo para manejo de órdenes
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'
import {
  validateAndTransform,
  createOrderSchema,
  orderQuerySchema
} from '@/lib/validations'
import { ORDER_STATES, USER_ROLES } from '@/lib/constants'
import { generateSequentialOrderNumber } from '@/lib/order-utils'
import { withIdempotency } from '@/lib/idempotency'
import { FSMCache } from '@/lib/cache'
import { enqueueEmail, enqueueNotification } from '@/lib/queue'
import { Prisma } from '@prisma/client'

// =============================================
// GET /api/orders - Obtener órdenes con filtros
// =============================================

export const GET = withAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    // Validar parámetros de consulta
    const validation = orderQuerySchema.safeParse(queryParams)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parámetros de consulta inválidos',
          details: validation.error.errors
        },
        { status: 400 }
      )
    }

    const {
      page,
      limit,
      estado,
      urgencia,
      tipoElectrodomestico,
      fechaDesde,
      fechaHasta,
      search,
    } = validation.data

    // Construir filtros
    const where: Prisma.OrderWhereInput = {}

    // 🔒 RBAC: Filtrado por Rol
    if (user.role === USER_ROLES.CUSTOMER) {
      where.customerId = user.id
    } else {
      // Verificar si es técnico (buscando por email ya que el rol específico no está en enum principales)
      const technician = await prisma.technician.findUnique({
        where: { email: user.email }
      })

      if (technician && user.role !== USER_ROLES.ADMIN && user.role !== USER_ROLES.SUPER_ADMIN && user.role !== USER_ROLES.TECHNICIAN_MANAGER) {
        // Es un técnico, solo ver sus asignaciones
        where.assignments = {
          some: {
            technicianId: technician.id
          }
        }
      }
    }

    if (estado) where.estado = estado
    if (urgencia) where.urgencia = urgencia
    if (tipoElectrodomestico) where.tipoElectrodomestico = tipoElectrodomestico

    if (fechaDesde || fechaHasta) {
      where.createdAt = {
        ...(fechaDesde ? { gte: new Date(fechaDesde) } : {}),
        ...(fechaHasta ? { lte: new Date(fechaHasta) } : {}),
      }
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { nombre: { contains: search, mode: 'insensitive' } },
        { telefono: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Calcular offset
    const offset = (page - 1) * limit

    // Obtener órdenes con paginación
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
      prisma.order.count({ where })
    ])

    // Calcular información de paginación
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage
        }
      }
    })

  } catch (error) {
    console.error('Error obteniendo órdenes:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
})

// =============================================
// POST /api/orders - Crear nueva orden
// =============================================

export const POST = withAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  // Envolver con idempotencia (no requerida para compatibilidad)
  return withIdempotency(request, async (req) => {
    try {
      const body = await req.json()

      // Validar datos de entrada
      const validation = validateAndTransform(createOrderSchema, body)
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

      const orderData = validation.data

      // Generar número de orden secuencial (formato ORD-YYYY-NNNN)
      // MEJORA: Ahora usa OrderSequence para garantizar atomicidad
      const numeroOrden = await generateSequentialOrderNumber()

      // Crear la orden vinculada al usuario
      const order = await prisma.order.create({
        data: {
          ...orderData,
          customerId: user.role === USER_ROLES.CUSTOMER ? user.id : undefined,
          orderNumber: numeroOrden,
          estado: ORDER_STATES.PENDIENTE,
          fechaPreferida: orderData.fechaPreferida ? new Date(orderData.fechaPreferida) : null
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

      // Crear registro de historial
      await prisma.orderHistory.create({
        data: {
          orderId: order.id,
          estadoAnterior: null,
          estadoNuevo: ORDER_STATES.PENDIENTE,
          notas: 'Orden creada',
          changedBy: 'system'
        }
      })

      // ✅ Invalidar cache del dashboard (nueva orden afecta estadísticas)
      await FSMCache.invalidateOrderCache()

      // ✅ Notificaciones asíncronas (no bloquean la respuesta)
      try {
        // Email de confirmación al cliente
        await enqueueEmail({
          to: order.email,
          subject: `Orden Confirmada - #${order.orderNumber}`,
          template: 'order-created',
          data: {
            orderNumber: order.orderNumber,
            customerName: order.nombre,
            customerEmail: order.email,
            customerPhone: order.telefono,
            serviceType: order.tipoServicio,
            applianceType: order.tipoElectrodomestico,
            description: order.descripcionProblema || '',
            address: order.direccion,
            preferredDate: order.fechaPreferida?.toLocaleDateString('es-CO') || 'Sin fecha específica',
            status: 'Pendiente'
          }
        }, 'high')

        // Notificación a administradores
        await enqueueNotification({
          userId: 'admin',
          title: 'Nueva Orden Creada',
          message: `Orden #${order.orderNumber} para ${order.tipoElectrodomestico} en ${order.ciudad}`,
          type_notification: 'status_change'
        }, 'medium')

      } catch (queueError) {
        console.error('Error encolando notificaciones de nueva orden:', queueError)
        // No fallar la creación por errores de notificación
      }

      return NextResponse.json({
        success: true,
        message: 'Orden creada exitosamente',
        data: order
      }, { status: 201 })

    } catch (error) {
      console.error('Error creando orden:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Error interno del servidor'
        },
        { status: 500 }
      )
    }
  }, { required: false }) // No requerido para mantener compatibilidad con clientes existentes
})
