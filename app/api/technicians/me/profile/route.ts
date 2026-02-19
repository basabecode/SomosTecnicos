/**
 * API Perfil del Técnico Autenticado
 * GET  /api/technicians/me/profile — obtener datos completos
 * PUT  /api/technicians/me/profile — actualizar información personal y preferencias
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function authTechnician(request: NextRequest) {
  const auth = await authenticateRequest(request)
  if (!auth.authenticated || !auth.user) {
    return { error: 'No autorizado', status: 401, user: null, technician: null }
  }
  if (auth.user.role !== 'technician') {
    return { error: 'Acceso denegado', status: 403, user: null, technician: null }
  }

  const technician = await prisma.technician.findUnique({
    where: { email: auth.user.email }
  })

  if (!technician) {
    return { error: 'Perfil de técnico no encontrado', status: 404, user: null, technician: null }
  }

  return { error: null, status: 200, user: auth.user, technician }
}

// =============================================
// GET /api/technicians/me/profile
// =============================================

export async function GET(request: NextRequest) {
  const { error, status, user, technician } = await authTechnician(request)
  if (error || !user || !technician) {
    return NextResponse.json({ success: false, error }, { status })
  }

  try {
    // Obtener preferencias y datos de idioma del AdminUser
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: user.id },
      select: {
        nombre: true,
        apellido: true,
        telefono: true,
        preferencias: true,
        idioma: true,
        zona: true,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        // Datos operativos del técnico
        id: technician.id,
        nombre: technician.nombre,
        email: technician.email,
        telefono: technician.telefono,
        cedula: technician.cedula,
        ciudad: technician.ciudad,
        especialidades: technician.especialidades,
        zonaTrabajoArea: technician.zonaTrabajoArea,
        estadoActual: technician.estadoActual,
        disponible: technician.disponible,
        calificacionPromedio: technician.calificacionPromedio,
        ordenesCompletadas: technician.ordenesCompletadas,
        fechaIngreso: technician.fechaIngreso,
        // Datos de cuenta (AdminUser)
        apellido: adminUser?.apellido ?? null,
        preferencias: adminUser?.preferencias ?? null,
        idioma: adminUser?.idioma ?? 'es',
        zona: adminUser?.zona ?? null,
      }
    })
  } catch (err) {
    console.error('Error obteniendo perfil del técnico:', err)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// =============================================
// PUT /api/technicians/me/profile
// =============================================

export async function PUT(request: NextRequest) {
  const { error, status, user, technician } = await authTechnician(request)
  if (error || !user || !technician) {
    return NextResponse.json({ success: false, error }, { status })
  }

  try {
    const body = await request.json()
    const {
      nombre,
      apellido,
      telefono,
      ciudad,
      especialidades,
      zonaTrabajoArea,
      preferencias,
      idioma,
    } = body

    if (nombre !== undefined && nombre.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'El nombre no puede estar vacío' },
        { status: 400 }
      )
    }

    // Actualizar tabla Technician (datos operativos)
    const updatedTechnician = await prisma.technician.update({
      where: { email: user.email },
      data: {
        ...(nombre && { nombre: nombre.trim() }),
        ...(telefono !== undefined && { telefono: telefono.trim() }),
        ...(ciudad !== undefined && { ciudad: ciudad?.trim() || null }),
        ...(especialidades !== undefined && { especialidades }),
        ...(zonaTrabajoArea !== undefined && { zonaTrabajoArea: zonaTrabajoArea || null }),
        ultimaActividad: new Date(),
      }
    })

    // Actualizar AdminUser (datos de cuenta y preferencias)
    const updatedAdmin = await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        ...(nombre && { nombre: nombre.trim() }),
        ...(apellido !== undefined && { apellido: apellido?.trim() || null }),
        ...(telefono !== undefined && { telefono: telefono?.trim() || null }),
        ...(preferencias !== undefined && { preferencias }),
        ...(idioma !== undefined && { idioma }),
      },
      select: {
        nombre: true,
        apellido: true,
        telefono: true,
        preferencias: true,
        idioma: true,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      data: {
        ...updatedAdmin,
        ciudad: updatedTechnician.ciudad,
        especialidades: updatedTechnician.especialidades,
        zonaTrabajoArea: updatedTechnician.zonaTrabajoArea,
      }
    })
  } catch (err) {
    console.error('Error actualizando perfil del técnico:', err)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
