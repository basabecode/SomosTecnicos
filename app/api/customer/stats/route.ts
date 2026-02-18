
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'
import { USER_ROLES, ORDER_STATES } from '@/lib/constants'

export const GET = withAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    // Verificar que sea cliente
    if (user.role !== USER_ROLES.CUSTOMER) {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado' },
        { status: 403 }
      )
    }

    const customerId = user.id

    // Obtener información del cliente para memberSince
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { createdAt: true }
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    // Obtener estadísticas de órdenes
    const orders = await prisma.order.findMany({
      where: { customerId },
      select: {
        estado: true,
        costoFinal: true,
        costoEstimado: true,
      }
    })

    const totalServices = orders.length
    const completedServices = orders.filter(o => o.estado === ORDER_STATES.COMPLETADO || o.estado === 'completado').length // Ajustar según constants
    const cancelledServices = orders.filter(o => o.estado === ORDER_STATES.CANCELADO || o.estado === 'cancelado').length

    // Servicios activos son los que no están completados ni cancelados
    const activeServices = totalServices - completedServices - cancelledServices

    // Calcular total gastado (suma de costoFinal de servicios completados)
    const totalSpent = orders
      .filter(o => o.estado === ORDER_STATES.COMPLETADO || o.estado === 'completado')
      .reduce((acc, curr) => acc + (Number(curr.costoFinal) || 0), 0)

    // Mock rating ya que no hay sistema de feedback en el esquema actual
    // TODO: Implementar cálculo real cuando exista modelo de calificaciones
    const averageRating = 5.0

    return NextResponse.json({
      success: true,
      stats: {
        totalServices,
        completedServices,
        activeServices,
        averageRating,
        memberSince: customer.createdAt,
        totalSpent
      }
    })

  } catch (error) {
    console.error('Error obteniendo estadísticas de cliente:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
