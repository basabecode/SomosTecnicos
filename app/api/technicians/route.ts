/**
 * API de Técnicos - Endpoints principales
 * GET /api/technicians - Listar técnicos con filtros
 * POST /api/technicians - Crear nuevo técnico
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, requireTechnicianManager, AuthenticatedUser } from '@/lib/auth'
import { validateAndTransform, createTechnicianSchema } from '@/lib/validations'
import { Prisma } from '@prisma/client'

// =============================================
// GET /api/technicians - Listar técnicos
// =============================================

export const GET = withAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { searchParams } = new URL(request.url)

    // Parámetros de consulta
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    const search = searchParams.get('search') || ''
    const activo = searchParams.get('activo')
    const disponible = searchParams.get('disponible')
    const especialidad = searchParams.get('especialidad')
    const ciudad = searchParams.get('ciudad')

    // Construir filtros
  const where: Prisma.TechnicianWhereInput = {}

    // Filtro de búsqueda por texto
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { telefono: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
        { cedula: { contains: search } }
      ]
    }

    // Filtros específicos
    if (activo !== null && activo !== undefined) {
      where.activo = activo === 'true'
    }

    if (disponible !== null && disponible !== undefined) {
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

    // Calcular offset
    const offset = (page - 1) * limit

    // Ejecutar consultas en paralelo
    const [technicians, total] = await Promise.all([
      prisma.technician.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: [
          { disponible: 'desc' }, // Disponibles primero
          { activo: 'desc' },     // Activos primero
          { calificacionPromedio: 'desc' }, // Mejor calificados primero
          { createdAt: 'desc' }   // Más recientes primero
        ],
        include: {
          assignments: {
            where: {
              estado: { in: ['asignado', 'en_proceso'] }
            },
            include: {
              order: {
                select: {
                  id: true,
                  orderNumber: true,
                  nombre: true,
                  tipoElectrodomestico: true,
                  ciudad: true,
                  estado: true
                }
              }
            }
          },
          _count: {
            select: {
              assignments: {
                where: {
                  estado: 'completado'
                }
              }
            }
          }
        }
      }),
      prisma.technician.count({ where })
    ])

    // Calcular información de paginación
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    // Obtener los emails de los técnicos para buscar sus usuarios Admin asociados
    const emails = technicians.map(t => t.email)
    const adminUsers = await prisma.adminUser.findMany({
      where: { email: { in: emails } },
      select: { id: true, email: true }
    })

    // Crear mapa de email -> adminUserId
    const emailToAdminIdMap = new Map<string, number>()
    adminUsers.forEach(u => emailToAdminIdMap.set(u.email, u.id))

    // Procesar datos de técnicos
    const processedTechnicians = technicians.map(technician => {
      const { assignments, _count, ...rest } = technician
      const [currentAssignment] = assignments
      const adminUserId = emailToAdminIdMap.get(technician.email)

      return {
        ...rest,
        adminUserId: adminUserId, // ID vital para mensajería
        ordenesCompletadas: _count.assignments,
        asignacionActual: currentAssignment
          ? {
              id: currentAssignment.id,
              orderId: currentAssignment.orderId,
              numeroOrden: currentAssignment.order.orderNumber,
              cliente: currentAssignment.order.nombre,
              tipoElectrodomestico: currentAssignment.order.tipoElectrodomestico,
              ciudad: currentAssignment.order.ciudad,
              estado: currentAssignment.estado,
              fechaAsignacion: currentAssignment.createdAt,
            }
          : null,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        technicians: processedTechnicians,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage
        }
      }
    })

  } catch (error) {
    console.error('Error obteniendo técnicos:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
})

// =============================================
// POST /api/technicians - Crear técnico
// =============================================

export const POST = withAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  // Verificar permisos de administrador
  const authCheck = await requireTechnicianManager(request)
  if (!authCheck.authorized || !authCheck.user) {
    return NextResponse.json(
      {
        success: false,
        error: authCheck.error || 'No autorizado'
      },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    // Validar datos de entrada
    const validation = validateAndTransform(createTechnicianSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: validation.errors.errors
        },
        { status: 400 }
      )
    }

    const technicianData = validation.data

    // Verificar que no exista un técnico con la misma cédula
    const existingTechnician = await prisma.technician.findUnique({
      where: { cedula: technicianData.cedula }
    })

    if (existingTechnician) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ya existe un técnico registrado con esta cédula'
        },
        { status: 409 }
      )
    }

    // Verificar email único si se proporciona
    if (technicianData.email) {
      const existingEmail = await prisma.technician.findUnique({
        where: { email: technicianData.email }
      })

      if (existingEmail) {
        return NextResponse.json(
          {
            success: false,
            error: 'Ya existe un técnico registrado con este email'
          },
          { status: 409 }
        )
      }
    }

    // Crear el técnico
    const technician = await prisma.technician.create({
      data: {
        ...technicianData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Técnico creado exitosamente',
      data: technician
    }, { status: 201 })

  } catch (error) {
    console.error('Error creando técnico:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
})
