/**
 * API de Asignaciones - Versión Optimizada
 * GET /api/assignments/optimized - Listar asignaciones optimizado
 * POST /api/assignments/optimized - Crear nueva asignación optimizado
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import logger from '@/lib/logger'

// =============================================
// GET /api/assignments/optimized - Listar asignaciones optimizado
// =============================================

export const GET = withAuth(async (req) => {
  const startTime = Date.now()

  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const estado = searchParams.get('estado')
    const technicianId = searchParams.get('technicianId')
    const fechaDesde = searchParams.get('fechaDesde')
    const fechaHasta = searchParams.get('fechaHasta')

    // Filtros optimizados
    const where: any = {}

    if (estado && estado !== 'todos') {
      where.estado = estado
    }

    if (technicianId) {
      where.technicianId = parseInt(technicianId)
    }

    if (fechaDesde || fechaHasta) {
      where.fechaProgramada = {
        ...(fechaDesde ? { gte: new Date(fechaDesde) } : {}),
        ...(fechaHasta ? { lte: new Date(fechaHasta) } : {}),
      }
    }

    const offset = (page - 1) * limit

    // Query optimizada con transacción
    const result = await prisma.$transaction(async (tx) => {
      // Query 1: Asignaciones con eager loading completo (elimina N+1)
      const assignments = await tx.assignment.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: [
          { fechaProgramada: 'asc' },
          { fechaAsignacion: 'desc' }
        ],
        select: {
          id: true,
          estado: true,
          fechaAsignacion: true,
          fechaProgramada: true,
          fechaInicio: true,
          fechaCompletada: true,
          notasAsignacion: true,
          notasTecnico: true,
          tiempoEstimado: true,
          tiempoReal: true,
          razonCancelacion: true,
          costoManoObra: true,
          costoRepuestos: true,
          createdAt: true,
          updatedAt: true,
          // Eager loading de orden con campos selectivos
          order: {
            select: {
              id: true,
              orderNumber: true,
              nombre: true,
              telefono: true,
              direccion: true,
              ciudad: true,
              tipoElectrodomestico: true,
              marca: true,
              modelo: true,
              tipoServicio: true,
              descripcionProblema: true,
              urgencia: true,
              estado: true,
              costoEstimado: true,
              costoFinal: true,
              createdAt: true
            }
          },
          // Eager loading de técnico con campos selectivos
          technician: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              email: true,
              especialidades: true,
              disponible: true,
              calificacionPromedio: true,
              zonaTrabajoArea: true
            }
          }
        }
      })

      // Query 2: Count total
      const total = await tx.assignment.count({ where })

      // Query 3: Estadísticas agregadas (opcional, solo si se necesitan)
      const stats = await tx.assignment.groupBy({
        by: ['estado'],
        where,
        _count: {
          id: true
        }
      })

      return { assignments, total, stats }
    })

    // Procesamiento de datos optimizado
    const processedAssignments = result.assignments.map(assignment => ({
      ...assignment,
      // Información calculada del costo total
      costoTotal: (Number(assignment.costoManoObra) || 0) + (Number(assignment.costoRepuestos) || 0),
      // Duración calculada
      duration: assignment.fechaInicio && assignment.fechaCompletada
        ? Math.round((assignment.fechaCompletada.getTime() - assignment.fechaInicio.getTime()) / (1000 * 60)) // minutos
        : null,
      // Estado de eficiencia
      efficiency: assignment.tiempoEstimado && assignment.tiempoReal
        ? Math.round(((assignment.tiempoEstimado / assignment.tiempoReal) * 100))
        : null,
      // Información de contacto rápido
      customerContact: {
        name: assignment.order.nombre,
        phone: assignment.order.telefono,
        address: assignment.order.direccion,
        city: assignment.order.ciudad
      },
      // Información del técnico
      technicianInfo: {
        name: assignment.technician.nombre,
        phone: assignment.technician.telefono,
        specialties: assignment.technician.especialidades,
        rating: Number(assignment.technician.calificacionPromedio)
      }
    }))

    // Estadísticas procesadas
    const statsProcessed = result.stats.reduce((acc, stat) => {
      acc[stat.estado] = stat._count.id
      return acc
    }, {} as Record<string, number>)

    const totalPages = Math.ceil(result.total / limit)
    const duration = Date.now() - startTime

    logger.info(`Asignaciones listadas con optimización - Página: ${page}, Total: ${result.total}, Duración: ${duration}ms`)

    return NextResponse.json({
      assignments: processedAssignments,
      statistics: statsProcessed,
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

    logger.error('Error al listar asignaciones optimizadas',
      error instanceof Error ? error : new Error('Error desconocido'))

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})

// =============================================
// POST /api/assignments/optimized - Crear nueva asignación optimizado
// =============================================

export const POST = withAuth(async (req) => {
  const startTime = Date.now()

  try {
    const body = await req.json()

    const {
      orderId,
      technicianId,
      fechaProgramada,
      notasAsignacion,
      tiempoEstimado
    } = body

    // Validaciones básicas
    if (!orderId || !technicianId) {
      return NextResponse.json(
        { error: 'orderId y technicianId son requeridos' },
        { status: 400 }
      )
    }

    // Crear asignación con verificaciones optimizadas
    const newAssignment = await prisma.$transaction(async (tx) => {
      // Query 1: Verificar que la orden existe y está disponible
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          orderNumber: true,
          estado: true,
          tipoElectrodomestico: true,
          urgencia: true,
          assignments: {
            where: {
              estado: { in: ['asignado', 'en_proceso'] }
            },
            select: { id: true }
          }
        }
      })

      if (!order) {
        throw new Error('Orden no encontrada')
      }

      if (order.assignments.length > 0) {
        throw new Error('La orden ya tiene una asignación activa')
      }

      // Query 2: Verificar que el técnico existe y está disponible
      const technician = await tx.technician.findUnique({
        where: { id: technicianId },
        select: {
          id: true,
          nombre: true,
          activo: true,
          disponible: true,
          especialidades: true,
          assignments: {
            where: {
              estado: { in: ['asignado', 'en_proceso'] },
              fechaProgramada: fechaProgramada ? {
                gte: new Date(new Date(fechaProgramada).setHours(0, 0, 0, 0)),
                lt: new Date(new Date(fechaProgramada).setHours(23, 59, 59, 999))
              } : undefined
            },
            select: { id: true }
          }
        }
      })

      if (!technician) {
        throw new Error('Técnico no encontrado')
      }

      if (!technician.activo) {
        throw new Error('El técnico no está activo')
      }

      if (!technician.disponible) {
        throw new Error('El técnico no está disponible')
      }

      // Verificar conflicto de horario si se especifica fecha
      if (fechaProgramada && technician.assignments.length > 0) {
        throw new Error('El técnico ya tiene una asignación programada para esa fecha')
      }

      // Query 3: Crear la asignación
      const assignment = await tx.assignment.create({
        data: {
          orderId,
          technicianId,
          fechaAsignacion: new Date(),
          fechaProgramada: fechaProgramada ? new Date(fechaProgramada) : null,
          notasAsignacion: notasAsignacion || null,
          tiempoEstimado: tiempoEstimado || null,
          estado: 'asignado'
        },
        select: {
          id: true,
          estado: true,
          fechaAsignacion: true,
          fechaProgramada: true,
          notasAsignacion: true,
          tiempoEstimado: true,
          order: {
            select: {
              id: true,
              orderNumber: true,
              nombre: true,
              tipoElectrodomestico: true,
              urgencia: true
            }
          },
          technician: {
            select: {
              id: true,
              nombre: true,
              telefono: true
            }
          }
        }
      })

      // Query 4: Actualizar estado de la orden
      await tx.order.update({
        where: { id: orderId },
        data: {
          estado: 'asignado',
          updatedAt: new Date()
        }
      })

      return assignment
    })

    const duration = Date.now() - startTime

    logger.info(`Nueva asignación creada - Orden: ${newAssignment.order.orderNumber}, Técnico: ${newAssignment.technician.nombre} en ${duration}ms`)

    return NextResponse.json(newAssignment, { status: 201 })

  } catch (error) {
    const duration = Date.now() - startTime

    logger.error('Error al crear asignación optimizada',
      error instanceof Error ? error : new Error('Error desconocido'))

    if (error instanceof Error && (
      error.message.includes('no encontrada') ||
      error.message.includes('ya tiene una asignación') ||
      error.message.includes('no está activo') ||
      error.message.includes('no está disponible') ||
      error.message.includes('programada para esa fecha')
    )) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
