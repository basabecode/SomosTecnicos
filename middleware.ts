/**
 * Middleware Global de Next.js
 * Protege rutas admin y APIs automáticamente
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// =============================================
// CONFIGURACIÓN
// =============================================

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'

// Rutas que requieren autenticación
const PROTECTED_PATHS = [
  '/admin',
  '/manager',
  '/technician',
  '/customer',
  '/customer/dashboard',
  '/customer/services',
  '/customer/profile',
  '/customer/history',
  '/customer/messages',
  '/customer/settings',
  '/customer/warranty',
  '/customer/request',
  '/api/orders',
  '/api/technicians',
  '/api/reports',
  '/api/auth/me',
  '/api/auth/refresh',
  '/api/auth/logout'
]

// Rutas públicas (excepciones)
const PUBLIC_PATHS = [
  '/login',          // Página de login unificado debe ser pública
  '/admin-info',     // Página de información del admin debe ser pública
  '/register/customer', // Página de registro del cliente debe ser pública
  '/register/technician', // Página de registro de técnicos debe ser pública
  '/customer/forgot-password', // Página de recuperar contraseña debe ser pública
  '/api/auth/login',
  '/api/health',
  '/api/status'
]

// =============================================
// UTILIDADES
// =============================================

/**
 * Verifica si una ruta está protegida
 */
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(path => pathname.startsWith(path))
}

/**
 * Verifica si una ruta es pública (excepción)
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(path => pathname.startsWith(path))
}

/**
 * Extrae token de cookies o header Authorization
 */
function extractToken(request: NextRequest): string | null {
  // Intentar obtener de cookies primero (para rutas web)
  const cookieToken = request.cookies.get('auth-token')?.value
  if (cookieToken) {
    return cookieToken
  }

  // Intentar obtener del header Authorization (para APIs)
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

/**
 * Verifica y decodifica token JWT usando jose (compatible con Edge Runtime)
 */
async function verifyToken(token: string): Promise<any | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    console.error('Error verificando token en middleware:', error)
    return null
  }
}

// =============================================
// MIDDLEWARE PRINCIPAL
// =============================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Log para debugging (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔒 Middleware: ${request.method} ${pathname}`)
  }

  // Permitir rutas públicas explícitas
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Verificar si la ruta necesita protección
  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  // Extraer token
  const token = extractToken(request)

  if (!token) {
    // Para rutas protegidas de interfaz redirigir al login unificado
    if (pathname.startsWith('/admin') || pathname.startsWith('/manager') || pathname.startsWith('/technician') || pathname.startsWith('/customer')) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Para APIs devolver 401
    return NextResponse.json(
      {
        success: false,
        error: 'Token de autenticación requerido',
        code: 'AUTH_REQUIRED'
      },
      { status: 401 }
    )
  }

  // Verificar token (ahora es async)
  const payload = await verifyToken(token)

  if (!payload) {
    // Token inválido - limpiar cookie y redirigir/responder
    const response = (pathname.startsWith('/admin') || pathname.startsWith('/manager') || pathname.startsWith('/technician') || pathname.startsWith('/customer'))
      ? NextResponse.redirect(new URL('/login', request.url))
      : NextResponse.json(
          {
            success: false,
            error: 'Token de autenticación inválido',
            code: 'AUTH_INVALID'
          },
          { status: 401 }
        )

    // Limpiar cookie de token inválido
    response.cookies.delete('auth-token')
    return response
  }

  // Token válido - agregar headers con info del usuario para las APIs
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payload.id?.toString() || '')
  requestHeaders.set('x-user-role', payload.role || '')
  requestHeaders.set('x-user-name', payload.nombre || '')

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  })
}

// =============================================
// CONFIGURACIÓN DE RUTAS
// =============================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
