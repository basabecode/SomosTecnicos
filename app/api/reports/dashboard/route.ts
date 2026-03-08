import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'
import { USER_ROLES, ORDER_STATES } from '@/lib/constants'

type RangeKey = '1m' | '3m' | '6m' | '1y'

function getRangeDays(range: RangeKey): number {
  switch (range) {
    case '1m':
      return 30
    case '3m':
      return 90
    case '6m':
      return 180
    case '1y':
      return 365
    default:
      return 180
  }
}

export const GET = withAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const allowedRoles: string[] = [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.TECHNICIAN_MANAGER,
      USER_ROLES.VIEWER,
    ]

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'No autorizado para ver reportes' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const rangeParam = (searchParams.get('range') || '6m') as RangeKey
    const range = (['1m', '3m', '6m', '1y'] as const).includes(rangeParam) ? rangeParam : '6m'
    const days = getRangeDays(range)

    const now = new Date()
    const startDate = new Date(now)
    startDate.setDate(now.getDate() - days)

    const [orders, technicians] = await Promise.all([
      prisma.order.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        select: {
          createdAt: true,
          estado: true,
          tipoElectrodomestico: true,
          costoFinal: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.technician.findMany({
        where: { activo: true },
        select: {
          id: true,
          nombre: true,
          calificacionPromedio: true,
          assignments: {
            select: {
              createdAt: true,
              estado: true,
            },
          },
        },
      }),
    ])

    const dailyMap = new Map<string, { total: number; completed: number; cancelled: number; pending: number; revenue: number }>()
    for (const order of orders) {
      const dateKey = order.createdAt.toISOString().split('T')[0]
      const bucket = dailyMap.get(dateKey) ?? {
        total: 0,
        completed: 0,
        cancelled: 0,
        pending: 0,
        revenue: 0,
      }

      bucket.total += 1
      if (order.estado === ORDER_STATES.COMPLETADO) bucket.completed += 1
      if (order.estado === ORDER_STATES.CANCELADO) bucket.cancelled += 1
      if (order.estado === ORDER_STATES.PENDIENTE) bucket.pending += 1
      bucket.revenue += Number(order.costoFinal ?? 0)
      dailyMap.set(dateKey, bucket)
    }

    const ordersOverTime = Array.from(dailyMap.entries()).map(([date, value]) => ({
      date,
      ...value,
    }))

    const serviceMap = new Map<string, { count: number; revenue: number }>()
    for (const order of orders) {
      const key = order.tipoElectrodomestico || 'otros'
      const current = serviceMap.get(key) ?? { count: 0, revenue: 0 }
      current.count += 1
      current.revenue += Number(order.costoFinal ?? 0)
      serviceMap.set(key, current)
    }

    const serviceTypes = Array.from(serviceMap.entries()).map(([type, value]) => ({
      type,
      count: value.count,
      revenue: value.revenue,
      averageTime: 0,
      satisfaction: 0,
    }))

    const technicianPerformance = technicians.map(tech => {
      const inRangeAssignments = tech.assignments.filter(a => a.createdAt >= startDate)
      const completedJobs = inRangeAssignments.filter(a => a.estado === 'completado').length
      const efficiency = inRangeAssignments.length > 0
        ? Number(((completedJobs / inRangeAssignments.length) * 100).toFixed(1))
        : 0

      return {
        id: tech.id,
        name: tech.nombre,
        completedJobs,
        averageRating: Number(tech.calificacionPromedio),
        totalEarnings: 0,
        efficiency,
        responseTime: 0,
      }
    })

    const totalOrders = orders.length
    const completedOrders = orders.filter(o => o.estado === ORDER_STATES.COMPLETADO).length
    const cancelledOrders = orders.filter(o => o.estado === ORDER_STATES.CANCELADO).length
    const activeOrders = orders.filter(
      o => o.estado !== ORDER_STATES.COMPLETADO && o.estado !== ORDER_STATES.CANCELADO
    ).length
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.costoFinal ?? 0), 0)
    const previousPeriodStart = new Date(startDate)
    previousPeriodStart.setDate(previousPeriodStart.getDate() - days)
    const previousPeriodOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
    })
    const growth =
      previousPeriodOrders > 0
        ? Number((((totalOrders - previousPeriodOrders) / previousPeriodOrders) * 100).toFixed(1))
        : 0

    return NextResponse.json({
      success: true,
      data: {
        ordersOverTime,
        technicianPerformance,
        serviceTypes,
        monthlyStats: {
          totalOrders,
          completedOrders,
          activeOrders,
          cancelledOrders,
          averageRating:
            technicianPerformance.length > 0
              ? Number(
                  (
                    technicianPerformance.reduce((sum, t) => sum + t.averageRating, 0) /
                    technicianPerformance.length
                  ).toFixed(1)
                )
              : 0,
          totalRevenue,
          growth,
        },
      },
    })
  } catch (error) {
    console.error('Error en /api/reports/dashboard:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
