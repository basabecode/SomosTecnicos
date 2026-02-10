/**
 * API de Órdenes - Versión Optimizada
 * GET /api/orders/optimized - Listar órdenes optimizado
 * POST /api/orders/optimized - Crear nueva orden optimizado
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import { ORDER_STATES } from '@/lib/constants'
import { generateSequentialOrderNumber } from '@/lib/order-utils'
import logger from '@/lib/logger'

// =============================================
// GET /api/orders/optimized - Listar órdenes optimizado
// =============================================

export const GET = withAuth(async (req) => {
  const startTime = Date.now()

  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // Máximo 100
    const estado = searchParams.get('estado')
    const fechaDesde = searchParams.get('fechaDesde')
    const fechaHasta = searchParams.get('fechaHasta')
    const search = searchParams.get('search')

    // Filtros optimizados
    const where: any = {}

    if (estado && estado !== 'todos') {
      where.estado = estado
    }

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

    const offset = (page - 1) * limit

    // Query optimizada con transacción y eager loading
    const result = await prisma.$transaction(async (tx) => {
      // Query 1: Obtener órdenes con eager loading selectivo (elimina N+1)
      const orders = await tx.order.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          nombre: true,
          telefono: true,
          email: true,
          direccion: true,
          ciudad: true,
          tipoElectrodomestico: true,
          marca: true,
          modelo: true,
          tipoServicio: true,
          descripcionProblema: true,
          urgencia: true,
          fechaPreferida: true,
          estado: true,
          prioridad: true,
          costoEstimado: true,
          costoFinal: true,
          createdAt: true,
          updatedAt: true,
          fechaCompletado: true,
          // Eager loading optimizado de asignaciones
          assignments: {
            select: {
              id: true,
              estado: true,
              fechaAsignacion: true,
              fechaProgramada: true,
              fechaInicio: true,
              fechaCompletada: true,
              notasAsignacion: true,
              technician: {
                select: {
                  id: true,
                  nombre: true,
                  telefono: true,
                  especialidades: true,
                  disponible: true
                }
              }
            },
            orderBy: {
              fechaAsignacion: 'desc'
            }
          }
        }
      })

      // Query 2: Count total (ejecutada en paralelo dentro de la transacción)
      const total = await tx.order.count({ where })

      return { orders, total }
    })

    // Procesamiento de datos optimizado
    const processedOrders = result.orders.map(order => ({
      ...order,
      // Información de técnico actual (último asignado)
      currentTechnician: order.assignments[0]?.technician || null,
      // Estado de asignación actual
      assignmentStatus: order.assignments[0]?.estado || null,
      // Fecha programada más reciente
      scheduledDate: order.assignments[0]?.fechaProgramada || null,
      // Total de asignaciones
      assignmentCount: order.assignments.length
    }))

    const totalPages = Math.ceil(result.total / limit)
    const duration = Date.now() - startTime

    logger.info(`Órdenes listadas con optimización - Página: ${page}, Total: ${result.total}, Duración: ${duration}ms`)

    return NextResponse.json({
      orders: processedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: result.total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      performance: {
        queryTime: duration,
        optimized: true
      }
    })

  } catch (error) {
    const duration = Date.now() - startTime

    logger.error('Error al listar órdenes optimizadas',
      error instanceof Error ? error : new Error('Error desconocido'))

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})

// =============================================
// POST /api/orders/optimized - Crear nueva orden optimizado
// =============================================

export const POST = withAuth(async (req) => {
  const startTime = Date.now()

  try {
    const body = await req.json()

    const {
      nombre,
      telefono,
      email,
      direccion,
      ciudad,
      tipoElectrodomestico,
      marca,
      modelo,
      año,
      tipoServicio,
      descripcionProblema,
      urgencia,
      fechaPreferida,
      horario,
      comentarios,
      customerId
    } = body

    // Validaciones básicas
    if (!nombre || !telefono || !email || !tipoElectrodomestico || !tipoServicio) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      )
    }

    // Generar número de orden secuencial (formato ORD-YYYY-NNNN)
    const orderNumber = await generateSequentialOrderNumber()

    // Crear orden con transacción optimizada
    const newOrder = await prisma.$transaction(async (tx) => {
      // Verificar si existe una orden reciente similar (anti-duplicados)
      const existingOrder = await tx.order.findFirst({
        where: {
          email,
          tipoElectrodomestico,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24 horas
          }
        },
        select: { id: true, orderNumber: true }
      })

      if (existingOrder) {
        throw new Error(`Ya existe una orden similar: ${existingOrder.orderNumber}`)
      }

      // Crear la orden optimizada
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: customerId || null,
          nombre,
          telefono,
          email,
          direccion,
          ciudad,
          tipoElectrodomestico,
          marca: marca || null,
          modelo: modelo || null,
          año: año || null,
          tipoServicio,
          descripcionProblema: descripcionProblema || null,
          urgencia: urgencia || 'media',
          fechaPreferida: fechaPreferida ? new Date(fechaPreferida) : null,
          horario: horario || null,
          comentarios: comentarios || null,
          estado: ORDER_STATES.PENDIENTE,
          prioridad: urgencia === 'alta' ? 3 : urgencia === 'media' ? 2 : 1
        },
        select: {
          id: true,
          orderNumber: true,
          nombre: true,
          email: true,
          tipoElectrodomestico: true,
          tipoServicio: true,
          estado: true,
          urgencia: true,
          createdAt: true
        }
      })

      return order
    })

    const duration = Date.now() - startTime

    logger.info(`Nueva orden creada exitosamente - ${newOrder.orderNumber} (${newOrder.tipoServicio}, ${newOrder.urgencia}) en ${duration}ms`)

    return NextResponse.json(newOrder, { status: 201 })

  } catch (error) {
    const duration = Date.now() - startTime

    logger.error('Error al crear orden optimizada',
      error instanceof Error ? error : new Error('Error desconocido'))

    if (error instanceof Error && error.message.includes('Ya existe una orden similar')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
