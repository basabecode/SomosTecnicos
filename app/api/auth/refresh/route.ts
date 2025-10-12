/**
 * API de Refresh Token
 * Renueva tokens de acceso usando refresh token
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  getUserById
} from '@/lib/auth'

// =============================================
// POST /api/auth/refresh
// =============================================

export async function POST(request: NextRequest) {
  try {
    // Obtener refresh token de la cookie
    const refreshToken = request.cookies.get('refreshToken')?.value

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Refresh token no encontrado'
        },
        { status: 401 }
      )
    }

    // Verificar refresh token
    const payload = verifyRefreshToken(refreshToken)
    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          error: 'Refresh token inválido'
        },
        { status: 401 }
      )
    }

    // Obtener usuario actualizado
  const user = await getUserById(payload.userId, payload.userType)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado'
        },
        { status: 404 }
      )
    }

    // Generar nuevos tokens
    const newAccessToken = generateToken(user)
  const newRefreshToken = generateRefreshToken(user.id, user.userType)

    // Crear respuesta
    const response = NextResponse.json({
      success: true,
      message: 'Tokens renovados exitosamente',
      data: {
        user,
        accessToken: newAccessToken,
        expiresIn: '24h'
      }
    })

    // Actualizar cookie de refresh token
    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 días
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Error renovando token:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}
