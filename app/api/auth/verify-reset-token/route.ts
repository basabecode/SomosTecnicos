/**
 * API Route: GET /api/auth/verify-reset-token
 * Verificar validez de un token de recuperación de contraseña
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    // Validar que el token existe
    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token no proporcionado' },
        { status: 400 }
      )
    }

    // Buscar el token en la base de datos
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      select: {
        id: true,
        userEmail: true,
        userType: true,
        expiresAt: true,
        used: true,
        usedAt: true
      }
    })

    // Token no existe
    if (!resetToken) {
      return NextResponse.json(
        { valid: false, error: 'Token inválido' },
        { status: 404 }
      )
    }

    // Token ya fue usado
    if (resetToken.used) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Este enlace ya fue utilizado',
          usedAt: resetToken.usedAt
        },
        { status: 400 }
      )
    }

    // Token expirado
    const now = new Date()
    if (resetToken.expiresAt < now) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Este enlace ha expirado',
          expiredAt: resetToken.expiresAt
        },
        { status: 400 }
      )
    }

    // Token válido
    return NextResponse.json(
      {
        valid: true,
        email: resetToken.userEmail,
        userType: resetToken.userType
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ Error verificando token:', error)
    return NextResponse.json(
      { valid: false, error: 'Error verificando el token' },
      { status: 500 }
    )
  }
}
