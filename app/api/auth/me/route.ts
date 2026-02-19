/**
 * API de Perfil de Usuario
 * Obtiene y actualiza información del usuario autenticado
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// =============================================
// GET /api/auth/me
// =============================================


export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    if (user.userType === 'customer') {
      const fullCustomer = await prisma.customer.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          username: true,
          email: true,
          nombre: true,
          apellido: true,
          telefono: true,
          direccion: true,
          ciudad: true,
          activo: true,
          createdAt: true,
          updatedAt: true,
          lastLogin: true
        }
      })

      if (!fullCustomer) {
        return NextResponse.json(
          {
            success: false,
            error: 'Cliente no encontrado'
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          ...fullCustomer,
          role: user.role,
          userType: user.userType
        }
      })
    }

    const fullUser = await prisma.adminUser.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        role: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true
      }
    })

    if (!fullUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...fullUser,
        userType: user.userType
      }
    })

  } catch (error) {
    console.error('Error obteniendo perfil:', error)
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
// PATCH /api/auth/me — Actualizar perfil
// =============================================

export const PATCH = withAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const body = await request.json()

    if (user.userType === 'customer') {
      const { nombre, apellido, telefono, direccion, ciudad, preferencias } = body

      if (!nombre || nombre.trim() === '') {
        return NextResponse.json(
          { success: false, error: 'El nombre es requerido' },
          { status: 400 }
        )
      }

      const updated = await prisma.customer.update({
        where: { id: user.id },
        data: {
          ...(nombre && { nombre: nombre.trim() }),
          ...(apellido !== undefined && { apellido: apellido?.trim() || null }),
          ...(telefono !== undefined && { telefono: telefono.trim() }),
          ...(direccion !== undefined && { direccion: direccion?.trim() || null }),
          ...(ciudad !== undefined && { ciudad: ciudad?.trim() || null }),
          ...(preferencias !== undefined && { preferencias }),
        },
        select: {
          id: true,
          username: true,
          email: true,
          nombre: true,
          apellido: true,
          telefono: true,
          direccion: true,
          ciudad: true,
          preferencias: true,
          updatedAt: true,
        }
      })

      return NextResponse.json({ success: true, data: updated })
    }

    // Admin / Technician (AdminUser table)
    const { nombre, apellido, telefono, preferencias, idioma, zona } = body

    if (!nombre || nombre.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    const updated = await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        ...(nombre && { nombre: nombre.trim() }),
        ...(apellido !== undefined && { apellido: apellido?.trim() || null }),
        ...(telefono !== undefined && { telefono: telefono?.trim() || null }),
        ...(preferencias !== undefined && { preferencias }),
        ...(idioma !== undefined && { idioma }),
        ...(zona !== undefined && { zona }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        role: true,
        preferencias: true,
        idioma: true,
        zona: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Error actualizando perfil:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
