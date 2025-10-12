/**
 * API de Reportes de Órdenes
 * GET /api/reports/orders - Reportes y análisis de órdenes
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'
import { ORDER_STATES } from '@/lib/constants'

// =============================================
// GET /api/reports/orders - Reportes de órdenes
// =============================================

export const GET = withAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { searchParams } = new URL(request.url)

    // Parámetros de consulta
    const fechaInicio = searchParams.get('fechaInicio')
    const fechaFin = searchParams.get('fechaFin')
    const tipoReporte = searchParams.get('tipo') || 'resumen' // resumen, detallado, temporal

    // Configurar fechas por defecto (último mes)
    const now = new Date()
    const defaultStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const defaultEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    const startDate = fechaInicio ? new Date(fechaInicio) : defaultStart
    const endDate = fechaFin ? new Date(fechaFin) : defaultEnd

    // Filtro base para el período
    const dateFilter = {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }

    // Reporte tipo resumen
    if (tipoReporte === 'resumen') {
      const [
        totalOrdenes,
        ordenesPorEstado,
        ordenesPorTipo,
        ordenesPorUrgencia,
        ordenesPorCiudad,
        promedioCompletacion,
        ingresosTotales
      ] = await Promise.all([
        // Total de órdenes en el período
        prisma.order.count({ where: dateFilter }),

        // Órdenes por estado
        prisma.order.groupBy({
          by: ['estado'],
          where: dateFilter,
          _count: { estado: true }
        }),

        // Órdenes por tipo de electrodoméstico
        prisma.order.groupBy({
          by: ['tipoElectrodomestico'],
          where: dateFilter,
          _count: { tipoElectrodomestico: true },
          orderBy: { _count: { tipoElectrodomestico: 'desc' } }
        }),

        // Órdenes por urgencia
        prisma.order.groupBy({
          by: ['urgencia'],
          where: dateFilter,
          _count: { urgencia: true }
        }),

        // Órdenes por ciudad
        prisma.order.groupBy({
          by: ['ciudad'],
          where: dateFilter,
          _count: { ciudad: true },
          orderBy: { _count: { ciudad: 'desc' } },
          take: 10
        }),

        // Tiempo promedio de completación (órdenes completadas)
        prisma.order.findMany({
          where: {
            ...dateFilter,
            estado: ORDER_STATES.COMPLETADO,
            fechaCompletado: { not: null }
          },
          select: {
            createdAt: true,
            fechaCompletado: true
          }
        }),

        // Ingresos totales del período
        prisma.order.aggregate({
          where: {
            ...dateFilter,
            estado: ORDER_STATES.COMPLETADO,
            costoFinal: { not: null }
          },
          _sum: { costoFinal: true },
          _avg: { costoFinal: true },
          _count: { costoFinal: true }
        })
      ])

      // Calcular promedio de días para completar
      const tiemposCompletacion = promedioCompletacion.map(orden => {
        const inicio = new Date(orden.createdAt)
        const fin = new Date(orden.fechaCompletado!)
        return Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
      })

      const promedioCompletacionDias = tiemposCompletacion.length > 0
        ? tiemposCompletacion.reduce((sum, days) => sum + days, 0) / tiemposCompletacion.length
        : 0

      return NextResponse.json({
        success: true,
        data: {
          periodo: {
            inicio: startDate,
            fin: endDate
          },
          resumen: {
            totalOrdenes,
            ordenesCompletadas: ordenesPorEstado.find(e => e.estado === ORDER_STATES.COMPLETADO)?._count.estado || 0,
            tasaCompletacion: totalOrdenes > 0
              ? Math.round(((ordenesPorEstado.find(e => e.estado === ORDER_STATES.COMPLETADO)?._count.estado || 0) / totalOrdenes) * 100 * 100) / 100
              : 0,
            promedioCompletacionDias: Math.round(promedioCompletacionDias * 100) / 100,
            ingresosTotales: ingresosTotales._sum.costoFinal || 0,
            ingresosPromedio: ingresosTotales._avg.costoFinal || 0,
            ordenesFacturadas: ingresosTotales._count.costoFinal || 0
          },
          distribucion: {
            porEstado: ordenesPorEstado.map(item => ({
              estado: item.estado,
              cantidad: item._count.estado,
              porcentaje: Math.round((item._count.estado / totalOrdenes) * 100 * 100) / 100
            })),
            porTipoElectrodomestico: ordenesPorTipo.map(item => ({
              tipo: item.tipoElectrodomestico,
              cantidad: item._count.tipoElectrodomestico,
              porcentaje: Math.round((item._count.tipoElectrodomestico / totalOrdenes) * 100 * 100) / 100
            })),
            porUrgencia: ordenesPorUrgencia.map(item => ({
              urgencia: item.urgencia,
              cantidad: item._count.urgencia,
              porcentaje: Math.round((item._count.urgencia / totalOrdenes) * 100 * 100) / 100
            })),
            porCiudad: ordenesPorCiudad.map(item => ({
              ciudad: item.ciudad,
              cantidad: item._count.ciudad,
              porcentaje: Math.round((item._count.ciudad / totalOrdenes) * 100 * 100) / 100
            }))
          }
        }
      })
    }

    // Reporte detallado
    if (tipoReporte === 'detallado') {
      const ordenesDetalladas = await prisma.order.findMany({
        where: dateFilter,
        include: {
          assignments: {
            include: {
              technician: {
                select: {
                  nombre: true,
                  telefono: true
                }
              }
            }
          },
          history: {
            take: 3,
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({
        success: true,
        data: {
          periodo: { inicio: startDate, fin: endDate },
          ordenes: ordenesDetalladas,
          total: ordenesDetalladas.length
        }
      })
    }

    // Reporte temporal (por defecto)
    const ordenesTemporales = await prisma.order.groupBy({
      by: ['createdAt'],
      where: dateFilter,
      _count: { id: true }
    })

    return NextResponse.json({
      success: true,
      data: {
        periodo: { inicio: startDate, fin: endDate },
        temporal: ordenesTemporales,
        tipo: tipoReporte
      }
    })

  } catch (error) {
    console.error('Error generando reporte de órdenes:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
})
