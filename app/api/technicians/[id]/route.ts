/**
 * API para técnico específico por ID
 * GET, PUT, DELETE para un técnico individual
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, requireTechnicianManager, AuthenticatedUser } from '@/lib/auth'
import { validateAndTransform, updateTechnicianSchema } from '@/lib/validations'

// =============================================
// GET /api/technicians/[id] - Obtener técnico por ID
// =============================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      const { id } = await params
      const technicianId = parseInt(id)

      if (isNaN(technicianId)) {
        return NextResponse.json(
          {
            success: false,
            error: 'ID de técnico inválido'
          },
          { status: 400 }
        )
      }

      const technician = await prisma.technician.findUnique({
        where: { id: technicianId },
        include: {
          assignments: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
              order: {
                select: {
                  id: true,
                  orderNumber: true,
                  nombre: true,
                  telefono: true,
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

      // Procesar datos del técnico
      const processedTechnician = {
        ...technician,
        ordenesCompletadas: technician._count.assignments,
        historialAsignaciones: technician.assignments.map(assignment => ({
          id: assignment.id,
          orderId: assignment.orderId,
          numeroOrden: assignment.order.orderNumber,
          cliente: assignment.order.nombre,
          telefono: assignment.order.telefono,
          tipoElectrodomestico: assignment.order.tipoElectrodomestico,
          tipoServicio: assignment.order.tipoServicio,
          ciudad: assignment.order.ciudad,
          direccion: assignment.order.direccion,
          estado: assignment.estado,
          urgencia: assignment.order.urgencia,
          fechaOrden: assignment.order.createdAt,
          fechaPreferida: assignment.order.fechaPreferida,
          fechaAsignacion: assignment.createdAt,
          fechaProgramada: assignment.fechaProgramada,
          notasAsignacion: assignment.notasAsignacion,
          notasTecnico: assignment.notasTecnico,
          tiempoEstimado: assignment.tiempoEstimado,
          tiempoReal: assignment.tiempoReal,
          costoManoObra: assignment.costoManoObra,
          costoRepuestos: assignment.costoRepuestos
        })),
        assignments: undefined, // No enviar data interna
        _count: undefined       // No enviar count interno
      }

      return NextResponse.json({
        success: true,
        data: processedTechnician
      })

    } catch (error) {
      console.error('Error obteniendo técnico:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Error interno del servidor'
        },
        { status: 500 }
      )
    }
  })(request)
}

// =============================================
// PUT /api/technicians/[id] - Actualizar técnico
// =============================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (req: NextRequest, user: AuthenticatedUser) => {
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
      const { id } = await params
      const technicianId = parseInt(id)

      if (isNaN(technicianId)) {
        return NextResponse.json(
          {
            success: false,
            error: 'ID de técnico inválido'
          },
          { status: 400 }
        )
      }

      // Verificar que el técnico existe
      const existingTechnician = await prisma.technician.findUnique({
        where: { id: technicianId }
      })

      if (!existingTechnician) {
        return NextResponse.json(
          {
            success: false,
            error: 'Técnico no encontrado'
          },
          { status: 404 }
        )
      }

      // Validar datos de entrada
      const body = await request.json()
      const validation = await validateAndTransform(updateTechnicianSchema, body)

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

      const validatedData = validation.data

      // Actualizar técnico
      const updatedTechnician = await prisma.technician.update({
        where: { id: technicianId },
        data: {
          nombre: validatedData.nombre,
          telefono: validatedData.telefono,
          email: validatedData.email,
          especialidades: validatedData.especialidades,
          zonaTrabajoArea: validatedData.zonaTrabajoArea,
          activo: validatedData.activo,
          disponible: validatedData.disponible,
          updatedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Técnico actualizado exitosamente',
        data: updatedTechnician
      })

    } catch (error) {
      console.error('Error actualizando técnico:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Error interno del servidor'
        },
        { status: 500 }
      )
    }
  })(request)
}

// =============================================
// DELETE /api/technicians/[id] - Desactivar técnico
// =============================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (req: NextRequest, user: AuthenticatedUser) => {
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
      const { id } = await params
      const technicianId = parseInt(id)

      if (isNaN(technicianId)) {
        return NextResponse.json(
          {
            success: false,
            error: 'ID de técnico inválido'
          },
          { status: 400 }
        )
      }

      // Verificar que el técnico existe
      const existingTechnician = await prisma.technician.findUnique({
        where: { id: technicianId }
      })

      if (!existingTechnician) {
        return NextResponse.json(
          {
            success: false,
            error: 'Técnico no encontrado'
          },
          { status: 404 }
        )
      }

      // Verificar si tiene asignaciones activas
      const activeAssignments = await prisma.assignment.count({
        where: {
          technicianId: technicianId,
          estado: {
            in: ['asignado', 'en_camino', 'en_proceso']
          }
        }
      })

      if (activeAssignments > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `No se puede desactivar el técnico. Tiene ${activeAssignments} asignación(es) activa(s)`
          },
          { status: 400 }
        )
      }

      // Desactivar técnico (soft delete)
      const deactivatedTechnician = await prisma.technician.update({
        where: { id: technicianId },
        data: {
          activo: false,
          disponible: false,
          updatedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Técnico desactivado exitosamente',
        data: deactivatedTechnician
      })

    } catch (error) {
      console.error('Error desactivando técnico:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Error interno del servidor'
        },
        { status: 500 }
      )
    }
  })(request)
}