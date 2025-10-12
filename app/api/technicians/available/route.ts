/**
 * API para obtener técnicos disponibles
 * GET /api/technicians/available - Técnicos disponibles para asignación
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedUser } from '@/lib/auth'
import { Prisma } from '@prisma/client'

// =============================================
// GET /api/technicians/available - Técnicos disponibles
// =============================================

export const GET = withAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { searchParams } = new URL(request.url)

    // Parámetros opcionales
    const especialidad = searchParams.get('especialidad')
    const ciudad = searchParams.get('ciudad')
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))

    // Construir filtros para técnicos disponibles
    const where: Prisma.TechnicianWhereInput = {
      activo: true,
      disponible: true
    }

    // Filtro por especialidad
    if (especialidad) {
      where.especialidades = {
        array_contains: [especialidad]
      }
    }

    // Filtro por zona/ciudad
    if (ciudad) {
      where.zonaTrabajoArea = {
        contains: ciudad,
        mode: 'insensitive'
      }
    }

    // Obtener técnicos disponibles
    const availableTechnicians = await prisma.technician.findMany({
      where,
      take: limit,
      orderBy: [
        { calificacionPromedio: 'desc' }, // Mejor calificados primero
        { ordenesCompletadas: 'desc' },   // Más experimentados primero
        { createdAt: 'asc' }              // Más antiguos primero (equidad)
      ],
      select: {
        id: true,
        nombre: true,
        telefono: true,
        especialidades: true,
        zonaTrabajoArea: true,
        calificacionPromedio: true,
        ordenesCompletadas: true,
        tiempoPromedioServicio: true
      }
    })

    // Verificar disponibilidad real (no tienen asignaciones activas)
    const techniciansWithAvailability = await Promise.all(
      availableTechnicians.map(async (technician) => {
        const activeAssignments = await prisma.assignment.count({
          where: {
            technicianId: technician.id,
            estado: { in: ['asignado', 'en_proceso'] }
          }
        })

        return {
          ...technician,
          hasActiveAssignments: activeAssignments > 0,
          isReallyAvailable: activeAssignments === 0
        }
      })
    )

    // Filtrar solo los realmente disponibles
    const reallyAvailableTechnicians = techniciansWithAvailability.filter(
      tech => tech.isReallyAvailable
    )

    return NextResponse.json({
      success: true,
      data: {
        technicians: reallyAvailableTechnicians.map(tech => ({
          id: tech.id,
          nombre: tech.nombre,
          telefono: tech.telefono,
          especialidades: tech.especialidades,
          zonaTrabajoArea: tech.zonaTrabajoArea,
          calificacionPromedio: tech.calificacionPromedio,
          ordenesCompletadas: tech.ordenesCompletadas,
          tiempoPromedioServicio: tech.tiempoPromedioServicio
        })),
        total: reallyAvailableTechnicians.length,
        filters: {
          especialidad: especialidad || null,
          ciudad: ciudad || null
        }
      }
    })

  } catch (error) {
    console.error('Error obteniendo técnicos disponibles:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
})
