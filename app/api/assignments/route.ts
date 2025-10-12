/**
 * API de Asignaciones
 * GET /api/assignments - Listar asignaciones con filtros
 * POST /api/assignments - Crear nueva asignación
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, requireTechnicianManager, AuthenticatedUser } from '@/lib/auth'
import { validateAndTransform, createAssignmentSchema } from '@/lib/validations'
import { Prisma } from '@prisma/client'

// =============================================
// GET /api/assignments - Listar asignaciones
// =============================================

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)

    // Parámetros de consulta
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    const estado = searchParams.get('estado')
    const technicianId = searchParams.get('technicianId')
    const orderId = searchParams.get('orderId')

  // Construir filtros
  const where: Prisma.AssignmentWhereInput = {}

    if (estado) {
      where.estado = estado
    }

    if (technicianId) {
      where.technicianId = parseInt(technicianId)
    }

    if (orderId) {
      where.orderId = orderId
    }

    // Calcular offset
    const offset = (page - 1) * limit

    // Ejecutar consultas en paralelo
    const [assignments, total] = await Promise.all([
      prisma.assignment.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          technician: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              especialidades: true,
              calificacionPromedio: true
            }
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              nombre: true,
              telefono: true,
              email: true,
              tipoElectrodomestico: true,
              tipoServicio: true,
              ciudad: true,
              direccion: true,
              estado: true,
              urgencia: true,
              createdAt: true,
              fechaPreferida: true
            }
          }
        }
      }),
      prisma.assignment.count({ where })
    ])

    // Calcular información de paginación
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: {
        assignments,
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
    console.error('Error obteniendo asignaciones:', error)
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
// POST /api/assignments - Crear asignación
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
    const validation = validateAndTransform(createAssignmentSchema, body)
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

    const assignmentData = validation.data

    // Verificar que la orden existe y no está ya asignada
    const existingOrder = await prisma.order.findUnique({
      where: { id: assignmentData.orderId },
      include: {
        assignments: {
          where: {
            estado: { in: ['asignado', 'en_proceso'] }
          }
        }
      }
    })

    if (!existingOrder) {
      return NextResponse.json(
        {
          success: false,
          error: 'Orden no encontrada'
        },
        { status: 404 }
      )
    }

    if (existingOrder.assignments.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Esta orden ya tiene una asignación activa'
        },
        { status: 409 }
      )
    }

    // Verificar que el técnico existe y está disponible
    const technician = await prisma.technician.findUnique({
      where: { id: assignmentData.technicianId },
      include: {
        assignments: {
          where: {
            estado: { in: ['asignado', 'en_proceso'] }
          }
        }
      }
    })

    if (!technician) {
      return NextResponse.json(
        {
          success: false,
          error: 'Técnico no encontrado'
        },
        { status: 404 }
      )
    }

    if (!technician.activo || !technician.disponible) {
      return NextResponse.json(
        {
          success: false,
          error: 'El técnico no está disponible para asignaciones'
        },
        { status: 409 }
      )
    }

    if (technician.assignments.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'El técnico ya tiene una asignación activa'
        },
        { status: 409 }
      )
    }

    // Usar transacción para crear la asignación y actualizar estados
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Crear la asignación
      const assignment = await tx.assignment.create({
        data: {
          ...assignmentData,
          estado: 'asignado',
          fechaAsignacion: new Date(),
          fechaProgramada: assignmentData.fechaProgramada ? new Date(assignmentData.fechaProgramada) : null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        include: {
          technician: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              especialidades: true
            }
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              nombre: true,
              tipoElectrodomestico: true,
              ciudad: true
            }
          }
        }
      })

      // Actualizar estado de la orden
      await tx.order.update({
        where: { id: assignmentData.orderId },
        data: {
          estado: 'asignado',
          updatedAt: new Date()
        }
      })

      // Marcar técnico como no disponible
      await tx.technician.update({
        where: { id: assignmentData.technicianId },
        data: {
          disponible: false,
          updatedAt: new Date()
        }
      })

      // Crear registro de historial
      await tx.orderHistory.create({
        data: {
          orderId: assignmentData.orderId,
          estadoAnterior: existingOrder.estado,
          estadoNuevo: 'asignado',
          notas: `Asignado a técnico: ${technician.nombre}`,
          changedBy: 'admin',
          changedById: user.id.toString()
        }
      })

      return assignment
    })

    return NextResponse.json({
      success: true,
      message: 'Asignación creada exitosamente',
      data: result
    }, { status: 201 })

  } catch (error) {
    console.error('Error creando asignación:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
})
