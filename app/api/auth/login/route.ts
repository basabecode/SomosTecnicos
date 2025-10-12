/**
 * API de Autenticación
 * Maneja login, logout y refresh de tokens
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  authenticateUser,
  authenticateCustomer,
  generateToken,
  generateRefreshToken
} from '@/lib/auth'
import { validateAndTransform } from '@/lib/validations'
import { loginSchema } from '@/lib/validations'

// =============================================
// POST /api/auth/login
// =============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos de entrada básicos
    const { email, password } = body
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email y contraseña son requeridos'
        },
        { status: 400 }
      )
    }

    // Intentar autenticar primero como usuario del sistema (admin/manager/technician)
    let user = await authenticateUser(email, password)

    // Si no se encuentra como usuario del sistema, intentar como cliente
    if (!user) {
      user = await authenticateCustomer(email, password)
    }
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Credenciales inválidas'
        },
        { status: 401 }
      )
    }

    // Generar tokens
    const accessToken = generateToken(user)
    const refreshToken = generateRefreshToken(user.id, user.userType)

    // Configurar cookie httpOnly para refresh token
    const response = NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        role: user.role || user.userType
      },
      accessToken,
      refreshToken,
      expiresIn: '24h'
    })

    // Configurar cookie segura para refresh token
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 días
      path: '/'
    })

    // Configurar cookie para access token (para que middleware pueda leerlo)
    response.cookies.set('auth-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 horas
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}
