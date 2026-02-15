/**
 * API de Gráficos del Técnico
 * GET /api/technicians/me/charts - Datos para visualizaciones personales
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

export const GET = withAuth(async (request, user) => {
  try {
    // Verificar que el usuario es un técnico
    if (user.role !== 'technician') {
      return NextResponse.json(
        { success: false, error: 'Acceso denegado' },
        { status: 403 }
      )
    }

    // Obtener el técnico por email
    const technician = await prisma.technician.findUnique({
      where: { email: user.email },
      select: { id: true }
    })

    if (!technician) {
      return NextResponse.json(
        { success: false, error: 'Técnico no encontrado' },
        { status: 404 }
      )
    }

    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last6Months = new Date(now.getFullYear(), now.getMonth() - 6, 1)

    // Servicios por día (últimos 7 días)
    const assignmentsByDay = await prisma.assignment.findMany({
      where: {
        technicianId: technician.id,
        estado: 'completado',
        updatedAt: { gte: last7Days }
      },
      select: {
        updatedAt: true
      }
    })

    // Procesar datos por día
    const serviciosPorDia = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
      fecha.setHours(0, 0, 0, 0)

      const cantidad = assignmentsByDay.filter(assignment => {
        const assignmentDate = new Date(assignment.updatedAt)
        assignmentDate.setHours(0, 0, 0, 0)
        return assignmentDate.getTime() === fecha.getTime()
      }).length

      return {
        fecha: fecha.toISOString(),
        cantidad
      }
    })

    // Servicios por tipo de electrodoméstico
    const assignmentsByType = await prisma.assignment.findMany({
      where: {
        technicianId: technician.id,
        estado: 'completado'
      },
      select: {
        order: {
          select: {
            tipoElectrodomestico: true
          }
        }
      }
    })

    const typeCount: Record<string, number> = {}
    assignmentsByType.forEach(assignment => {
      const tipo = assignment.order.tipoElectrodomestico
      typeCount[tipo] = (typeCount[tipo] || 0) + 1
    })

    const serviciosPorTipo = Object.entries(typeCount)
      .map(([tipo, cantidad]) => ({ tipo, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10) // Top 10

    // Calificaciones por mes (últimos 6 meses)
    // Por ahora usamos datos mock ya que no tenemos sistema de calificaciones implementado
    const calificacionesPorMes = Array.from({ length: 6 }, (_, i) => {
      const mes = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const mesNombre = mes.toLocaleDateString('es-CO', { month: 'short' })

      // Mock: calificación base + variación aleatoria
      const calificacion = 4.0 + Math.random() * 0.8

      return {
        mes: mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1),
        calificacion: Number(calificacion.toFixed(2))
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        serviciosPorDia,
        serviciosPorTipo,
        calificacionesPorMes
      }
    })

  } catch (error) {
    console.error('Error obteniendo datos de gráficos del técnico:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
})
