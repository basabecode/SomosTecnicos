/**
 * 🛡️ SomosTécnicos - Middleware de Autenticación JWT Robusto
 * =====================================================
 *
 * Proporciona validación JWT centralizada y segura para endpoints API
 * Maneja diferentes tipos de usuarios y roles
 */

import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { logger, logAPI } from '@/lib/logger'

// Tipos de usuario válidos
export type UserType = 'admin' | 'manager' | 'technician' | 'customer'
export type UserRole = 'admin' | 'manager' | 'technician' | 'customer'

interface JWTPayload {
  userId: string
  userType: UserType
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

interface AuthenticatedUser {
  id: string
  email: string
  type: UserType
  role: UserRole
  name: string
}

interface AuthResult {
  success: true
  user: AuthenticatedUser
  token: string
}

interface AuthError {
  success: false
  error: string
  statusCode: number
}

type AuthResponse = AuthResult | AuthError

/**
 * 🔑 Extrae y valida el token JWT del request
 */
function extractToken(request: NextRequest): string | null {
  // 1. Buscar en Authorization header (formato Bearer)
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // 2. Buscar en cookies (para requests del frontend)
  const cookieToken = request.cookies.get('accessToken')?.value
  if (cookieToken) {
    return cookieToken
  }

  // 3. Buscar en headers customizados
  const customToken = request.headers.get('x-access-token')
  if (customToken) {
    return customToken
  }

  return null
}

/**
 * 🔐 Verifica y decodifica el token JWT
 */
function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      logger.error('JWT_SECRET not configured', new Error('Missing JWT_SECRET'), {
        component: 'jwt-middleware'
      })
      return null
    }

    const decoded = jwt.verify(token, secret) as JWTPayload

    // Validar estructura del payload
    if (!decoded.userId || !decoded.userType || !decoded.email) {
      logger.warn('Invalid JWT payload structure', {
        component: 'jwt-middleware',
        metadata: { hasUserId: !!decoded.userId, hasUserType: !!decoded.userType, hasEmail: !!decoded.email }
      })
      return null
    }

    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.info('JWT token expired', {
        component: 'jwt-middleware',
        action: 'token_expired'
      })
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid JWT token', {
        component: 'jwt-middleware',
        action: 'invalid_token',
        metadata: { error: error.message }
      })
    } else {
      logger.error('Unexpected JWT verification error', error as Error, {
        component: 'jwt-middleware'
      })
    }
    return null
  }
}

/**
 * 🏗️ Construye el objeto de usuario autenticado
 */
async function buildAuthenticatedUser(payload: JWTPayload): Promise<AuthenticatedUser | null> {
  try {
    let userData = null

    // Buscar usuario según su tipo
    switch (payload.userType) {
      case 'admin':
      case 'manager':
        userData = await prisma.adminUser.findUnique({
          where: { id: parseInt(payload.userId) },
          select: { id: true, email: true, nombre: true, role: true }
        })
        if (userData) {
          userData = { ...userData, name: userData.nombre, role: userData.role }
        }
        break

      case 'technician':
        userData = await prisma.technician.findUnique({
          where: { id: parseInt(payload.userId) },
          select: { id: true, email: true, nombre: true }
        })
        if (userData) {
          userData = { ...userData, name: userData.nombre, role: 'technician' }
        }
        break

      case 'customer':
        userData = await prisma.customer.findUnique({
          where: { id: parseInt(payload.userId) },
          select: { id: true, email: true, nombre: true }
        })
        if (userData) {
          userData = { ...userData, name: userData.nombre, role: 'customer' }
        }
        break

      default:
        logger.warn('Unknown user type in JWT', {
          component: 'jwt-middleware',
          metadata: { userType: payload.userType, userId: payload.userId }
        })
        return null
    }

    if (!userData) {
      logger.warn('User not found in database', {
        component: 'jwt-middleware',
        userId: payload.userId,
        metadata: { userType: payload.userType }
      })
      return null
    }

    return {
      id: userData.id.toString(),
      email: userData.email,
      type: payload.userType,
      role: payload.role || payload.userType,
      name: userData.name
    }

  } catch (error) {
    logger.error('Database error while building authenticated user', error as Error, {
      component: 'jwt-middleware',
      userId: payload.userId,
      metadata: { userType: payload.userType }
    })
    return null
  }
}

/**
 * 🛡️ Middleware principal de autenticación
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthResponse> {
  const startTime = Date.now()

  try {
    // 1. Extraer token
    const token = extractToken(request)
    if (!token) {
      logAPI.response(request.method, request.url, 401, Date.now() - startTime)
      return {
        success: false,
        error: 'No authentication token provided',
        statusCode: 401
      }
    }

    // 2. Verificar token
    const payload = verifyToken(token)
    if (!payload) {
      logAPI.response(request.method, request.url, 401, Date.now() - startTime)
      return {
        success: false,
        error: 'Invalid or expired token',
        statusCode: 401
      }
    }

    // 3. Construir usuario
    const user = await buildAuthenticatedUser(payload)
    if (!user) {
      logAPI.response(request.method, request.url, 401, Date.now() - startTime)
      return {
        success: false,
        error: 'User not found or inactive',
        statusCode: 401
      }
    }

    // 4. Log de éxito
    logger.info('Request authenticated successfully', {
      component: 'jwt-middleware',
      userId: user.id,
      role: user.role,
      action: 'auth_success',
      metadata: {
        method: request.method,
        path: new URL(request.url).pathname,
        duration: Date.now() - startTime
      }
    })

    return {
      success: true,
      user,
      token
    }

  } catch (error) {
    const duration = Date.now() - startTime
    logger.error('Authentication middleware error', error as Error, {
      component: 'jwt-middleware',
      metadata: {
        method: request.method,
        path: new URL(request.url).pathname,
        duration
      }
    })

    logAPI.response(request.method, request.url, 500, duration)

    return {
      success: false,
      error: 'Internal authentication error',
      statusCode: 500
    }
  }
}

/**
 * 🔐 Middleware específico para roles de administración
 */
export async function requireAdminAccess(request: NextRequest): Promise<AuthResponse> {
  const authResult = await authenticateRequest(request)

  if (!authResult.success) {
    return authResult
  }

  const allowedRoles: UserRole[] = ['admin', 'manager']
  if (!allowedRoles.includes(authResult.user.role)) {
    logger.warn('Insufficient privileges for admin access', {
      component: 'jwt-middleware',
      userId: authResult.user.id,
      role: authResult.user.role,
      action: 'access_denied',
      metadata: {
        requiredRoles: allowedRoles,
        path: new URL(request.url).pathname
      }
    })

    return {
      success: false,
      error: 'Insufficient privileges',
      statusCode: 403
    }
  }

  return authResult
}

/**
 * 👷 Middleware específico para técnicos y managers
 */
export async function requireTechnicianAccess(request: NextRequest): Promise<AuthResponse> {
  const authResult = await authenticateRequest(request)

  if (!authResult.success) {
    return authResult
  }

  const allowedRoles: UserRole[] = ['admin', 'manager', 'technician']
  if (!allowedRoles.includes(authResult.user.role)) {
    logger.warn('Insufficient privileges for technician access', {
      component: 'jwt-middleware',
      userId: authResult.user.id,
      role: authResult.user.role,
      action: 'access_denied',
      metadata: {
        requiredRoles: allowedRoles,
        path: new URL(request.url).pathname
      }
    })

    return {
      success: false,
      error: 'Insufficient privileges',
      statusCode: 403
    }
  }

  return authResult
}

/**
 * 👤 Middleware específico para clientes
 */
export async function requireCustomerAccess(request: NextRequest): Promise<AuthResponse> {
  const authResult = await authenticateRequest(request)

  if (!authResult.success) {
    return authResult
  }

  // Clientes solo pueden acceder a sus propios recursos
  if (authResult.user.role !== 'customer') {
    logger.warn('Customer access required', {
      component: 'jwt-middleware',
      userId: authResult.user.id,
      role: authResult.user.role,
      action: 'access_denied',
      metadata: {
        requiredRole: 'customer',
        path: new URL(request.url).pathname
      }
    })

    return {
      success: false,
      error: 'Customer access required',
      statusCode: 403
    }
  }

  return authResult
}

/**
 * 🚦 Helper para crear respuestas de error HTTP
 */
export function createAuthErrorResponse(authResult: AuthError): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: authResult.error,
      message: authResult.error
    },
    { status: authResult.statusCode }
  )
}

/**
 * 📋 Helper para extraer información del usuario de un request autenticado
 */
export function getRequestUser(authResult: AuthResult): AuthenticatedUser {
  return authResult.user
}

// 📤 Exportar tipos para uso en otros archivos
export type { AuthResult, AuthError, AuthResponse, AuthenticatedUser, JWTPayload }
