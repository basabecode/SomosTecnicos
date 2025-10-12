/**
 * API del Dashboard - Versión Optimizada con N+1 Query Elimination
 * GET /api/dashboard/stats/optimized - Estadísticas optimizadas del dashboard
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import { ORDER_STATES } from '@/lib/constants'
import logger from '@/lib/logger'

// =============================================
// GET /api/dashboard/stats/optimized - Métricas optimizadas
// =============================================

export const GET = withAuth(async () => {
  const startTime = Date.now()

  try {
    // Uso de transacciones Prisma para garantizar consistencia y rendimiento
    const stats = await prisma.$transaction(async (tx) => {
      // Fechas para cálculos temporales
      const now = new Date()
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      // Query 1: Estadísticas de órdenes con agregaciones (elimina múltiples queries)
      const orderStatsByStatus = await tx.order.groupBy({
        by: ['estado'],
        _count: {
          id: true
        },
        _sum: {
          costoFinal: true
        },
        _avg: {
          costoFinal: true
        }
      })

      // Query 2: Órdenes por periodo temporal optimizada
      const ordersByPeriod = await tx.order.groupBy({
        by: ['estado'],
        where: {
          OR: [
            { fechaCompletado: { gte: startOfToday } },
            { fechaCompletado: { gte: startOfMonth } },
            { fechaCompletado: { gte: startOfWeek } },
            { createdAt: { gte: startOfToday } }
          ]
        },
        _count: {
          id: true
        }
      })

      // Query 3: Técnicos con métricas agregadas
      const technicianStats = await tx.technician.groupBy({
        by: ['activo', 'disponible'],
        _count: {
          id: true
        }
      })

      // Query 4: Asignaciones activas por técnico (para calcular técnicos en servicio)
      const activeTechnicianAssignments = await tx.assignment.groupBy({
        by: ['technicianId'],
        where: {
          estado: { in: ['asignado', 'en_proceso'] }
        },
        _count: {
          id: true
        }
      })

      // Query 5: Órdenes urgentes pendientes
      const urgentOrders = await tx.order.count({
        where: {
          urgencia: 'alta',
          estado: { in: [ORDER_STATES.PENDIENTE, ORDER_STATES.ASIGNADO] }
        }
      })

      // Query 6: Órdenes vencidas optimizada
      const overdueOrders = await tx.order.count({
        where: {
          OR: [
            {
              estado: ORDER_STATES.PENDIENTE,
              createdAt: { lt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) }
            },
            {
              estado: { in: [ORDER_STATES.ASIGNADO, ORDER_STATES.EN_PROCESO] },
              updatedAt: { lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
            }
          ]
        }
      })

      // Query 7: Órdenes recientes con eager loading (elimina N+1)
      const recentOrders = await tx.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          nombre: true,
          tipoElectrodomestico: true,
          ciudad: true,
          estado: true,
          urgencia: true,
          createdAt: true,
          assignments: {
            where: { estado: { in: ['asignado', 'en_proceso'] } },
            select: {
              technician: {
                select: { nombre: true }
              }
            },
            take: 1
          }
        }
      })

      // Query 8: Mejores técnicos con métricas pre-calculadas
      const topTechnicians = await tx.technician.findMany({
        where: { activo: true },
        take: 5,
        orderBy: [
          { calificacionPromedio: 'desc' },
          { ordenesCompletadas: 'desc' }
        ],
        select: {
          id: true,
          nombre: true,
          calificacionPromedio: true,
          ordenesCompletadas: true,
          disponible: true,
          _count: {
            select: {
              assignments: {
                where: {
                  estado: 'completado',
                  fechaCompletada: { gte: startOfMonth }
                }
              }
            }
          }
        }
      })

      // Query 9: Total de órdenes
      const totalOrders = await tx.order.count()

      // Query 10: Total de técnicos
      const totalTechnicians = await tx.technician.count()

      return {
        orderStatsByStatus,
        ordersByPeriod,
        technicianStats,
        activeTechnicianAssignments,
        urgentOrders,
        overdueOrders,
        recentOrders,
        topTechnicians,
        totalOrders,
        totalTechnicians
      }
    })

    // Procesamiento optimizado de estadísticas
    const processedStats = {
      // Métricas de órdenes procesadas desde aggregations
      ordenes: {
        total: stats.totalOrders,
        pendientes: stats.orderStatsByStatus.find(s => s.estado === ORDER_STATES.PENDIENTE)?._count.id || 0,
        asignadas: stats.orderStatsByStatus.find(s => s.estado === ORDER_STATES.ASIGNADO)?._count.id || 0,
        enProceso: stats.orderStatsByStatus.find(s => s.estado === ORDER_STATES.EN_PROCESO)?._count.id || 0,
        completadas: stats.orderStatsByStatus.find(s => s.estado === ORDER_STATES.COMPLETADO)?._count.id || 0,
        canceladas: stats.orderStatsByStatus.find(s => s.estado === ORDER_STATES.CANCELADO)?._count.id || 0,
        vencidas: stats.overdueOrders,
        urgentes: stats.urgentOrders,
        completadasHoy: stats.ordersByPeriod.filter(o => o.estado === ORDER_STATES.COMPLETADO).reduce((sum, o) => sum + o._count.id, 0)
      },

      // Métricas de técnicos procesadas
      tecnicos: {
        total: stats.totalTechnicians,
        activos: stats.technicianStats.find(t => t.activo && t.disponible)?._count.id || 0,
        disponibles: stats.technicianStats.find(t => t.activo && t.disponible)?._count.id || 0,
        enServicio: stats.activeTechnicianAssignments.length
      },

      // Ingresos calculados
      ingresos: {
        mes: Number(stats.orderStatsByStatus
          .find(s => s.estado === ORDER_STATES.COMPLETADO)?._sum.costoFinal || 0),
        promedio: Number(stats.orderStatsByStatus
          .find(s => s.estado === ORDER_STATES.COMPLETADO)?._avg.costoFinal || 0)
      },

      // Órdenes recientes optimizadas
      ordenesRecientes: stats.recentOrders.map(orden => ({
        id: orden.id,
        numero: orden.orderNumber,
        cliente: orden.nombre,
        tipo: orden.tipoElectrodomestico,
        ciudad: orden.ciudad,
        estado: orden.estado,
        urgencia: orden.urgencia,
        fecha: orden.createdAt,
        tecnico: orden.assignments[0]?.technician?.nombre || null
      })),

      // Mejores técnicos optimizados
      mejoresTecnicos: stats.topTechnicians.map(tech => ({
        id: tech.id,
        nombre: tech.nombre,
        calificacion: Number(tech.calificacionPromedio),
        completadas: tech.ordenesCompletadas,
        disponible: tech.disponible,
        completadasMes: tech._count.assignments
      })),

      // Métricas de rendimiento
      performance: {
        queryTime: Date.now() - startTime,
        optimized: true,
        method: 'aggregation_transaction'
      }
    }

    const duration = Date.now() - startTime

    logger.info(`Dashboard stats optimizado generado - Total órdenes: ${stats.totalOrders}, Técnicos: ${stats.totalTechnicians}, Duración: ${duration}ms`)

    return NextResponse.json(processedStats)

  } catch (error) {
    const duration = Date.now() - startTime

    logger.error('Error al generar estadísticas optimizadas del dashboard',
      error instanceof Error ? error : new Error('Error desconocido'))

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
