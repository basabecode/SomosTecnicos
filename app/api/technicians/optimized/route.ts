/**
 * API de Técnicos - Versión Optimizada
 * GET /api/technicians/optimized - Listar técnicos optimizado
 * POST /api/technicians/optimized - Crear nuevo técnico optimizado
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import logger from '@/lib/logger'

// =============================================
// GET /api/technicians/optimized - Listar técnicos optimizado
// =============================================

export const GET = withAuth(async (req) => {
  const startTime = Date.now()

  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50) // Máximo 50
    const activo = searchParams.get('activo')
    const disponible = searchParams.get('disponible')
    const especialidad = searchParams.get('especialidad')
    const ciudad = searchParams.get('ciudad')
    const search = searchParams.get('search')

    // Filtros optimizados
    const where: any = {}

    if (activo !== null && activo !== 'todos') {
      where.activo = activo === 'true'
    }

    if (disponible !== null && disponible !== 'todos') {
      where.disponible = disponible === 'true'
    }

    if (especialidad) {
      where.especialidades = {
        array_contains: [especialidad]
      }
    }

    if (ciudad) {
      where.zonaTrabajoArea = { contains: ciudad, mode: 'insensitive' }
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { telefono: { contains: search } },
        { cedula: { contains: search } }
      ]
    }

    const offset = (page - 1) * limit

    // Query optimizada con transacción para consistencia
    const result = await prisma.$transaction(async (tx) => {
      // Query 1: Técnicos con eager loading selectivo (elimina N+1)
      const technicians = await tx.technician.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: [
          { disponible: 'desc' },
          { activo: 'desc' },
          { calificacionPromedio: 'desc' },
          { createdAt: 'desc' }
        ],
        select: {
          id: true,
          nombre: true,
          telefono: true,
          email: true,
          cedula: true,
          especialidades: true,
          zonaTrabajoArea: true,
          activo: true,
          disponible: true,
          ordenesCompletadas: true,
          calificacionPromedio: true,
          tiempoPromedioServicio: true,
          fechaIngreso: true,
          ultimaActividad: true,
          createdAt: true,
          updatedAt: true,
          // Eager loading optimizado de asignaciones activas
          assignments: {
            where: {
              estado: { in: ['asignado', 'en_proceso'] }
            },
            select: {
              id: true,
              estado: true,
              fechaAsignacion: true,
              fechaProgramada: true,
              order: {
                select: {
                  id: true,
                  orderNumber: true,
                  nombre: true,
                  tipoElectrodomestico: true,
                  ciudad: true,
                  estado: true,
                  urgencia: true
                }
              }
            },
            orderBy: {
              fechaProgramada: 'asc'
            }
          },
          // Count de asignaciones completadas optimizado
          _count: {
            select: {
              assignments: {
                where: {
                  estado: 'completado',
                  fechaCompletada: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // Este mes
                  }
                }
              }
            }
          }
        }
      })

      // Query 2: Count total
      const total = await tx.technician.count({ where })

      return { technicians, total }
    })

    // Procesamiento de datos optimizado
    const processedTechnicians = result.technicians.map(tech => ({
      ...tech,
      // Métricas calculadas
      assignmentsActive: tech.assignments.length,
      assignmentsThisMonth: tech._count.assignments,
      // Próxima asignación
      nextAssignment: tech.assignments[0] || null,
      // Estado calculado
      status: tech.activo ? (tech.disponible ? 'available' : 'busy') : 'inactive',
      // Calificación formateada
      rating: Number(tech.calificacionPromedio),
      // Tiempo promedio formateado (horas)
      avgServiceTime: tech.tiempoPromedioServicio ? Math.round(tech.tiempoPromedioServicio / 60) : null
    }))

    const totalPages = Math.ceil(result.total / limit)
    const duration = Date.now() - startTime

    logger.info(`Técnicos listados con optimización - Página: ${page}, Total: ${result.total}, Duración: ${duration}ms`)

    return NextResponse.json({
      technicians: processedTechnicians,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: result.total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      performance: {
        queryTime: duration,
        optimized: true
      }
    })

  } catch (error) {
    const duration = Date.now() - startTime

    logger.error('Error al listar técnicos optimizados',
      error instanceof Error ? error : new Error('Error desconocido'))

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})

// =============================================
// POST /api/technicians/optimized - Crear nuevo técnico optimizado
// =============================================

export const POST = withAuth(async (req) => {
  const startTime = Date.now()

  try {
    const body = await req.json()

    const {
      nombre,
      telefono,
      email,
      cedula,
      especialidades,
      zonaTrabajoArea,
      activo = true,
      disponible = true
    } = body

    // Validaciones básicas
    if (!nombre || !telefono || !email || !cedula) {
      return NextResponse.json(
        { error: 'Campos requeridos: nombre, telefono, email, cedula' },
        { status: 400 }
      )
    }

    if (!Array.isArray(especialidades) || especialidades.length === 0) {
      return NextResponse.json(
        { error: 'Debe especificar al menos una especialidad' },
        { status: 400 }
      )
    }

    // Crear técnico con verificaciones optimizadas
    const newTechnician = await prisma.$transaction(async (tx) => {
      // Verificar duplicados de manera eficiente
      const existing = await tx.technician.findFirst({
        where: {
          OR: [
            { telefono },
            { email },
            { cedula }
          ]
        },
        select: { id: true, telefono: true, email: true, cedula: true }
      })

      if (existing) {
        let field = ''
        if (existing.telefono === telefono) field = 'teléfono'
        else if (existing.email === email) field = 'email'
        else if (existing.cedula === cedula) field = 'cédula'

        throw new Error(`Ya existe un técnico con este ${field}`)
      }

      // Crear técnico optimizado
      const technician = await tx.technician.create({
        data: {
          nombre,
          telefono,
          email,
          cedula,
          especialidades,
          zonaTrabajoArea: zonaTrabajoArea || null,
          activo,
          disponible,
          ordenesCompletadas: 0,
          calificacionPromedio: 5.00,
          tiempoPromedioServicio: null
        },
        select: {
          id: true,
          nombre: true,
          telefono: true,
          email: true,
          cedula: true,
          especialidades: true,
          zonaTrabajoArea: true,
          activo: true,
          disponible: true,
          calificacionPromedio: true,
          createdAt: true
        }
      })

      return technician
    })

    const duration = Date.now() - startTime

    logger.info(`Nuevo técnico creado exitosamente - ${newTechnician.nombre} (${newTechnician.email}) en ${duration}ms`)

    return NextResponse.json(newTechnician, { status: 201 })

  } catch (error) {
    const duration = Date.now() - startTime

    logger.error('Error al crear técnico optimizado',
      error instanceof Error ? error : new Error('Error desconocido'))

    if (error instanceof Error && error.message.includes('Ya existe un técnico')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
