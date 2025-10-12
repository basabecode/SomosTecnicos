/**
 * API de Logout
 * Maneja el cierre de sesión invalidando tokens
 */

import { NextRequest, NextResponse } from 'next/server'
import { extractToken, invalidateToken } from '@/lib/auth'

// =============================================
// POST /api/auth/logout
// =============================================

export async function POST(request: NextRequest) {
  try {
    // Extraer token del header
    const token = extractToken(request)

    if (token) {
      // Invalidar token (en producción se agregaría a blacklist)
      await invalidateToken(token)
    }

    // Crear respuesta
    const response = NextResponse.json({
      success: true,
      message: 'Logout exitoso'
    })

    // Limpiar cookie de refresh token
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    // Limpiar cookie de auth token
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}
