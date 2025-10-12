/**
 * API de Perfil de Usuario
 * Obtiene y actualiza información del usuario autenticado
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
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
