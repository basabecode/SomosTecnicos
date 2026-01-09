/**
 * API para listar solicitudes de técnicos
 * Solo accesible para administradores
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRoles } from '@/lib/auth'
import { USER_ROLES } from '@/lib/constants'

async function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    if (estado && ['pendiente', 'aprobado', 'rechazado'].includes(estado)) {
      where.estado = estado
    }

    // Obtener solicitudes con paginación
    const [applications, total] = await Promise.all([
      prisma.technicianApplication.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.technicianApplication.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error obteniendo solicitudes:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener solicitudes'
      },
      { status: 500 }
    )
  }
}

export const GET = withRoles(
  [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN_MANAGER],
  handler
)
