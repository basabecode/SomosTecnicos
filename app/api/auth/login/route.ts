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
import { prisma } from '@/lib/prisma'

// =============================================
// POST /api/auth/login
// =============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos de entrada con Zod
    const validation = validateAndTransform(loginSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos de inicio de sesión inválidos',
          details: validation.errors.errors
        },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    // Verificar si es una solicitud de técnico pendiente
    const technicianApplication = await prisma.technicianApplication.findUnique({
      where: { email },
      select: {
        estado: true,
        nombre: true,
        apellido: true,
      },
    })

    // Si existe una solicitud pendiente, bloquear el acceso
    if (technicianApplication && technicianApplication.estado === 'pendiente') {
      return NextResponse.json(
        {
          success: false,
          error: 'Tu solicitud está siendo revisada',
          message: `Hola ${technicianApplication.nombre}, tu solicitud de técnico está pendiente de aprobación. Te notificaremos por email cuando sea aprobada.`,
          status: 'pending_approval',
        },
        { status: 403 }
      )
    }

    // Si la solicitud fue rechazada
    if (technicianApplication && technicianApplication.estado === 'rechazado') {
      return NextResponse.json(
        {
          success: false,
          error: 'Solicitud rechazada',
          message: 'Tu solicitud de técnico fue rechazada. Por favor, contacta al administrador para más información.',
          status: 'rejected',
        },
        { status: 403 }
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
    const refreshToken = generateRefreshToken(user.id, user.userType as 'admin' | 'customer')

    console.log(`✅ Login exitoso para: ${email} (ID: ${user.id}, Role: ${user.role || user.userType})`)

    // Configurar cookie httpOnly para refresh token
    const response = NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        role: user.role || user.userType,
        activo: user.activo,
        telefono: user.telefono,
        direccion: user.direccion,
        ciudad: user.ciudad
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
