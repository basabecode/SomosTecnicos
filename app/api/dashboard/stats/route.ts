/**
 * API del Dashboard - Métricas principales
 * GET /api/dashboard/stats - Estadísticas del dashboard
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import { ORDER_STATES } from '@/lib/constants'
import { FSMCache, withCache } from '@/lib/cache'
import logger from '@/lib/logger'

// =============================================
// GET /api/dashboard/stats - Métricas principales
// =============================================

export const GET = withAuth(async (request) => {
  try {
    // Verificar si se debe usar cache (query param ?nocache=1 lo desactiva)
    const url = new URL(request.url)
    const useCache = !url.searchParams.has('nocache')

    // Usar cache para los datos del dashboard
    const result = await withCache(
      'dashboard_stats',
      useCache,
      async () => await calculateDashboardStats()
    )

    return NextResponse.json({
      success: true,
      data: result.data,
      metadata: {
        fromCache: result.fromCache,
        cacheStatus: result.fromCache ? 'HIT' : 'MISS',
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error obteniendo estadísticas del dashboard:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
})

/**
 * Función separada para calcular estadísticas del dashboard
 * Permite reutilización y testing independiente
 */
async function calculateDashboardStats() {
    // Fechas para cálculos temporales
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Ejecutar todas las consultas en paralelo para optimizar rendimiento
    const [
      // Métricas de órdenes
      ordenesPendientes,
      ordenesAsignadas,
      ordenesEnProceso,
      ordenesCompletadasHoy,
      ordenesCompletadasMes,
      ordenesCompletadasSemana,
      ordenesCanceladas,
      totalOrdenes,
      ordenesVencidas,

      // Métricas de técnicos
      tecnicosActivos,
      tecnicosDisponibles,
      tecnicosEnServicio,
      totalTecnicos,

      // Métricas de negocio
      ingresosMes,
      ordenesUrgentes,

      // Órdenes recientes
      ordenesRecientes,

      // Técnicos con mejor rendimiento
      // Técnicos con mejor rendimiento
      mejoresTecnicos,

      // Solicitudes de técnicos pendientes
      technicianApplicationsPending
    ] = await Promise.all([
      // Órdenes por estado
      prisma.order.count({ where: { estado: ORDER_STATES.PENDIENTE } }),
      prisma.order.count({ where: { estado: ORDER_STATES.ASIGNADO } }),
      prisma.order.count({ where: { estado: ORDER_STATES.EN_PROCESO } }),
      prisma.order.count({
        where: {
          estado: ORDER_STATES.COMPLETADO,
          fechaCompletado: { gte: startOfToday }
        }
      }),
      prisma.order.count({
        where: {
          estado: ORDER_STATES.COMPLETADO,
          fechaCompletado: { gte: startOfMonth }
        }
      }),
      prisma.order.count({
        where: {
          estado: ORDER_STATES.COMPLETADO,
          fechaCompletado: { gte: startOfWeek }
        }
      }),
      prisma.order.count({ where: { estado: ORDER_STATES.CANCELADO } }),
      prisma.order.count(),

      // Órdenes vencidas (más de 3 días sin asignar o más de 7 días asignadas)
      prisma.order.count({
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
      }),

      // Técnicos por estado
      prisma.technician.count({ where: { activo: true } }),
      prisma.technician.count({ where: { activo: true, disponible: true } }),
      prisma.assignment.groupBy({
        by: ['technicianId'],
        where: {
          estado: { in: ['asignado', 'en_proceso'] }
        }
      }).then(result => result.length),
      prisma.technician.count(),

      // Ingresos del mes (suma de costos finales)
      prisma.order.aggregate({
        where: {
          estado: ORDER_STATES.COMPLETADO,
          fechaCompletado: { gte: startOfMonth },
          costoFinal: { not: null }
        },
        _sum: { costoFinal: true }
      }),

      // Órdenes urgentes pendientes
      prisma.order.count({
        where: {
          urgencia: 'alta',
          estado: { in: [ORDER_STATES.PENDIENTE, ORDER_STATES.ASIGNADO] }
        }
      }),

      // Órdenes recientes (últimas 10)
      prisma.order.findMany({
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
            }
          }
        }
      }),

      // Mejores técnicos (top 5 por calificación y órdenes completadas)
      prisma.technician.findMany({
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
          especialidades: true,
          assignments: {
            where: { estado: { in: ['asignado', 'en_proceso'] } },
            select: {
              order: {
                select: {
                  orderNumber: true,
                  tipoElectrodomestico: true
                }
              }
            }
          }
        }
      }),

      // Solicitudes pendientes
      prisma.technicianApplication.count({
        where: { estado: 'pendiente' }
      })
    ])

    // Calcular métricas derivadas
    const totalOrdenesActivas = ordenesPendientes + ordenesAsignadas + ordenesEnProceso
    const tasaCompletacion = totalOrdenes > 0 ? ((ordenesCompletadasMes / totalOrdenes) * 100) : 0
    const tecnicosOcupados = tecnicosActivos - tecnicosDisponibles

    // Calcular tiempo promedio de resolución (mock por ahora)
    const tiempoPromedioResolucion = 2.5 // días (se puede calcular con datos reales)

    // Construir respuesta
    const dashboardStats = {
      // Métricas principales de órdenes
      ordenes: {
        pendientes: ordenesPendientes,
        asignadas: ordenesAsignadas,
        enProceso: ordenesEnProceso,
        completadasHoy: ordenesCompletadasHoy,
        completadasMes: ordenesCompletadasMes,
        completadasSemana: ordenesCompletadasSemana,
        canceladas: ordenesCanceladas,
        total: totalOrdenes,
        activas: totalOrdenesActivas,
        vencidas: ordenesVencidas,
        urgentes: ordenesUrgentes
      },

      // Métricas de técnicos
      tecnicos: {
        activos: tecnicosActivos,
        disponibles: tecnicosDisponibles,
        ocupados: tecnicosOcupados,
        enServicio: tecnicosEnServicio,
        total: totalTecnicos
      },

      // Métricas de negocio
      negocio: {
        ingresosMes: ingresosMes._sum.costoFinal || 0,
        tasaCompletacion: Math.round(tasaCompletacion * 100) / 100,
        tiempoPromedioResolucion,
        satisfaccionPromedio: 4.3 // Mock - se puede calcular con reseñas reales
      },

      // Alertas y notificaciones
      alertas: {
        ordenesVencidas,
        ordenesUrgentes,
        technicianApplicationsPending,
        tecnicosSobrecargados: 0 // Se puede calcular técnicos con >3 asignaciones
      },

      // Datos adicionales para gráficos
      datosGraficos: {
  ordenesRecientes: ordenesRecientes.map(orden => ({
          id: orden.id,
          numeroOrden: orden.orderNumber,
          cliente: orden.nombre,
          tipoElectrodomestico: orden.tipoElectrodomestico,
          ciudad: orden.ciudad,
          estado: orden.estado,
          urgencia: orden.urgencia,
          fechaCreacion: orden.createdAt,
          tecnicoAsignado: orden.assignments[0]?.technician?.nombre || null
        })),

  mejoresTecnicos: mejoresTecnicos.map(tech => ({
          id: tech.id,
          nombre: tech.nombre,
          calificacion: tech.calificacionPromedio,
          ordenesCompletadas: tech.ordenesCompletadas,
          especialidades: tech.especialidades,
          asignacionActual: tech.assignments[0] ? {
            numeroOrden: tech.assignments[0].order.orderNumber,
            tipoElectrodomestico: tech.assignments[0].order.tipoElectrodomestico
          } : null
        }))
      },

      // Metadata
      ultimaActualizacion: new Date(),
      periodo: {
        inicio: startOfMonth,
        fin: now
      }
    }

    return dashboardStats
}
