/**
 * API de Estadísticas del Técnico
 * GET /api/technicians/me/stats - Estadísticas personales del técnico autenticado
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
      select: {
        id: true,
        nombre: true,
        zonaTrabajoArea: true,
        calificacionPromedio: true,
        ordenesCompletadas: true,
      }
    })

    if (!technician) {
      return NextResponse.json(
        { success: false, error: 'Técnico no encontrado' },
        { status: 404 }
      )
    }

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Obtener estadísticas en paralelo
    const [
      pendingCount,
      inProgressCount,
      completedTodayCount,
      completedWeekCount,
      completedMonthCount,
    ] = await Promise.all([
      // Asignaciones pendientes
      prisma.assignment.count({
        where: {
          technicianId: technician.id,
          estado: 'asignado'
        }
      }),

      // Asignaciones en progreso
      prisma.assignment.count({
        where: {
          technicianId: technician.id,
          estado: 'en_proceso'
        }
      }),

      // Completadas hoy
      prisma.assignment.count({
        where: {
          technicianId: technician.id,
          estado: 'completado',
          updatedAt: { gte: startOfToday }
        }
      }),

      // Completadas esta semana
      prisma.assignment.count({
        where: {
          technicianId: technician.id,
          estado: 'completado',
          updatedAt: { gte: startOfWeek }
        }
      }),

      // Completadas este mes
      prisma.assignment.count({
        where: {
          technicianId: technician.id,
          estado: 'completado',
          updatedAt: { gte: startOfMonth }
        }
      }),
    ])

    const stats = {
      pending: pendingCount,
      inProgress: inProgressCount,
      completedToday: completedTodayCount,
      completedWeek: completedWeekCount,
      completedMonth: completedMonthCount,
      averageRating: technician.calificacionPromedio ? Number(technician.calificacionPromedio) : 0,
      totalCompleted: technician.ordenesCompletadas,
      zona: technician.zonaTrabajoArea || 'Sin asignar'
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error obteniendo estadísticas del técnico:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
})
