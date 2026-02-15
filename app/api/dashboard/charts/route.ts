/**
 * API de Gráficos del Dashboard
 * GET /api/dashboard/charts - Datos para visualizaciones
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import { ORDER_STATES } from '@/lib/constants'

export const GET = withAuth(async () => {
  try {
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last6Months = new Date(now.getFullYear(), now.getMonth() - 6, 1)

    // Órdenes por día (últimos 7 días)
    const ordenesPorDiaRaw = await prisma.order.groupBy({
      by: ['createdAt'],
      _count: { id: true },
      where: {
        createdAt: { gte: last7Days }
      }
    })

    // Procesar datos por día
    const ordenesPorDia = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
      fecha.setHours(0, 0, 0, 0)

      const cantidad = ordenesPorDiaRaw.filter(orden => {
        const ordenFecha = new Date(orden.createdAt)
        ordenFecha.setHours(0, 0, 0, 0)
        return ordenFecha.getTime() === fecha.getTime()
      }).reduce((sum, orden) => sum + orden._count.id, 0)

      return {
        fecha: fecha.toISOString(),
        cantidad
      }
    })

    // Órdenes por estado
    const ordenesPorEstadoRaw = await prisma.order.groupBy({
      by: ['estado'],
      _count: { id: true }
    })

    const totalOrdenes = ordenesPorEstadoRaw.reduce((sum, item) => sum + item._count.id, 0)

    const ordenesPorEstado = ordenesPorEstadoRaw.map(item => ({
      estado: item.estado,
      cantidad: item._count.id,
      porcentaje: totalOrdenes > 0 ? (item._count.id / totalOrdenes) * 100 : 0
    }))

    // Órdenes por ciudad (top 10)
    const ordenesPorCiudadRaw = await prisma.order.groupBy({
      by: ['ciudad'],
      _count: { id: true },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    })

    const ordenesPorCiudad = ordenesPorCiudadRaw.map(item => ({
      ciudad: item.ciudad || 'Sin especificar',
      cantidad: item._count.id
    }))

    // Ingresos por mes (últimos 6 meses)
    const ingresosPorMesRaw = await prisma.order.groupBy({
      by: ['fechaCompletado'],
      _sum: { costoFinal: true },
      where: {
        estado: ORDER_STATES.COMPLETADO,
        fechaCompletado: { gte: last6Months },
        costoFinal: { not: null }
      }
    })

    // Procesar ingresos por mes
    const ingresosPorMes = Array.from({ length: 6 }, (_, i) => {
      const mes = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const mesNombre = mes.toLocaleDateString('es-CO', { month: 'short' })

      const ingresos = ingresosPorMesRaw
        .filter(item => {
          if (!item.fechaCompletado) return false
          const itemMes = new Date(item.fechaCompletado)
          return itemMes.getMonth() === mes.getMonth() &&
                 itemMes.getFullYear() === mes.getFullYear()
        })
        .reduce((sum, item) => {
          const costoFinal = item._sum.costoFinal
          return sum + (costoFinal ? Number(costoFinal) : 0)
        }, 0)

      return {
        mes: mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1),
        ingresos: Number(ingresos)
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ordenesPorDia,
        ordenesPorEstado,
        ordenesPorCiudad,
        ingresosPorMes
      }
    })

  } catch (error) {
    console.error('Error obteniendo datos de gráficos:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
})
