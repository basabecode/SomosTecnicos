/**
 * Middleware de Autenticación y Autorización
 * Protege rutas de API y maneja autenticación JWT
 */

import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { USER_ROLES } from '@/lib/constants'
import { logger, logAuth, logAPI } from '@/lib/logger'
// Los tipos se generarán automáticamente después de ejecutar prisma generate

// =============================================
// TIPOS
// =============================================

export interface AuthenticatedUser {
  id: number
  username: string
  email: string
  nombre: string
  apellido?: string
  role: string
  activo: boolean
  userType: 'admin' | 'customer'
  telefono?: string
  direccion?: string
  ciudad?: string
}

export interface JWTPayload extends AuthenticatedUser {
  iat: number
  exp: number
}

export interface AuthRequest extends NextRequest {
  user?: AuthenticatedUser
}

// =============================================
// AUTH BYPASS (SOLO TESTING)
// =============================================

function isAuthBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.AUTH_BYPASS_FOR_TESTS === 'true'
  )
}

function getBypassUserFromRequest(request: NextRequest): AuthenticatedUser | null {
  if (!isAuthBypassEnabled()) return null

  const mode = (process.env.AUTH_BYPASS_MODE || 'header').toLowerCase()
  const bypassHeader = request.headers.get('x-test-bypass')
  const shouldBypass = mode === 'always' || bypassHeader === '1' || bypassHeader === 'true'
  if (!shouldBypass) return null

  const roleFromHeader = request.headers.get('x-test-role')?.trim()
  const roleFromEnv = process.env.AUTH_BYPASS_ROLE?.trim()
  const role = roleFromHeader || roleFromEnv || USER_ROLES.ADMIN

  const idFromHeader = request.headers.get('x-test-user-id')
  const idFromEnv = process.env.AUTH_BYPASS_USER_ID
  const parsedId = Number(idFromHeader || idFromEnv || '1')
  const id = Number.isFinite(parsedId) && parsedId > 0 ? Math.trunc(parsedId) : 1

  const email =
    request.headers.get('x-test-email') ||
    process.env.AUTH_BYPASS_EMAIL ||
    `test.${role}@somostecnicos.local`

  const username =
    request.headers.get('x-test-username') ||
    process.env.AUTH_BYPASS_USERNAME ||
    `test_${role}`

  const nombre =
    request.headers.get('x-test-name') ||
    process.env.AUTH_BYPASS_NAME ||
    'Test User'

  // En este proyecto, técnicos/admins viven bajo userType "admin".
  const userType: 'admin' | 'customer' =
    role === USER_ROLES.CUSTOMER ? 'customer' : 'admin'

  return {
    id,
    username,
    email,
    nombre,
    role,
    activo: true,
    userType,
  }
}

// =============================================
// CONFIGURACIÓN JWT
// =============================================

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  return secret
}
const JWT_SECRET: string = getJwtSecret()
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'

// =============================================
// UTILIDADES DE TOKEN
// =============================================

/**
 * Genera un token JWT para un usuario
 */
export function generateToken(user: AuthenticatedUser): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      role: user.role,
      activo: user.activo,
      userType: user.userType
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'servicio-tecnico-app'
    } as jwt.SignOptions
  )
}

/**
 * Verifica y decodifica un token JWT
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'servicio-tecnico-app'
    }) as JWTPayload

    return decoded
  } catch (error) {
    console.error('Error verificando token:', error)
    return null
  }
}

/**
 * Extrae el token del header Authorization
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')

  if (!authHeader) return null

  // Formato: "Bearer token"
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1]
}

// =============================================
// AUTENTICACIÓN
// =============================================

/**
 * Autentica un usuario con email y contraseña
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthenticatedUser | null> {
  try {
    console.log(`🔍 Intentando autenticar usuario: ${email}`)

    // Buscar usuario por email (CORREGIDO: usando el modelo AdminUser correcto)
    const user = await prisma.adminUser.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash: true,
        nombre: true,
        apellido: true,
        role: true,
        activo: true,
        telefono: true
      }
    })

    if (!user || !user.activo) {
      return null
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return null
    }

    // Retornar usuario sin contraseña
    const { passwordHash: _passwordHash, ...authenticatedUser } = user
    return {
      ...authenticatedUser,
      apellido: authenticatedUser.apellido ?? undefined,
      telefono: authenticatedUser.telefono ?? undefined,
      userType: 'admin' as const
    }

  } catch (error) {
    console.error('Error autenticando usuario:', error)
    return null
  }
}

/**
 * Autentica un cliente con email y contraseña
 */
export async function authenticateCustomer(
  email: string,
  password: string
): Promise<AuthenticatedUser | null> {
  try {
    console.log(`🔍 Intentando autenticar cliente: ${email}`)

    const customer = await prisma.customer.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash: true,
        nombre: true,
        apellido: true,
        activo: true,
        telefono: true,
        direccion: true,
        ciudad: true
      }
    })

    if (!customer || !customer.activo) {
      return null
    }

    const isValidPassword = await bcrypt.compare(password, customer.passwordHash)
    if (!isValidPassword) {
      return null
    }

    const { passwordHash: _passwordHash, ...authenticatedCustomer } = customer
    return {
      ...authenticatedCustomer,
      apellido: authenticatedCustomer.apellido ?? undefined,
      telefono: authenticatedCustomer.telefono ?? undefined,
      direccion: authenticatedCustomer.direccion ?? undefined,
      ciudad: authenticatedCustomer.ciudad ?? undefined,
      role: USER_ROLES.CUSTOMER,
      userType: 'customer'
    }

  } catch (error) {
    console.error('Error autenticando cliente:', error)
    return null
  }
}

/**
 * Obtiene un usuario por ID
 */
async function getAdminUserById(id: number): Promise<AuthenticatedUser | null> {
  try {
    const user = await prisma.adminUser.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        nombre: true,
        apellido: true,
        role: true,
        activo: true,
        telefono: true
      }
    })

    if (!user || !user.activo) {
      return null
    }

    return {
      ...user,
      apellido: user.apellido ?? undefined,
      telefono: user.telefono ?? undefined,
      userType: 'admin' as const
    }

  } catch (error) {
    console.error('Error obteniendo usuario por ID:', error)
    return null
  }
}

export async function getCustomerById(id: number): Promise<AuthenticatedUser | null> {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        nombre: true,
        apellido: true,
        activo: true,
        telefono: true,
        direccion: true,
        ciudad: true
      }
    })

    if (!customer || !customer.activo) {
      return null
    }

    return {
      ...customer,
      apellido: customer.apellido ?? undefined,
      telefono: customer.telefono ?? undefined,
      direccion: customer.direccion ?? undefined,
      ciudad: customer.ciudad ?? undefined,
      role: USER_ROLES.CUSTOMER,
      userType: 'customer' as const
    }

  } catch (error) {
    console.error('Error obteniendo cliente por ID:', error)
    return null
  }
}

export async function getUserById(
  id: number,
  userType?: 'admin' | 'customer'
): Promise<AuthenticatedUser | null> {
  if (userType === 'admin') {
    return getAdminUserById(id)
  }

  if (userType === 'customer') {
    return getCustomerById(id)
  }

  const adminUser = await getAdminUserById(id)
  if (adminUser) {
    return adminUser
  }

  return getCustomerById(id)
}

/**
 * Hashea una contraseña
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Verifica si una contraseña coincide con su hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// =============================================
// MIDDLEWARE DE AUTENTICACIÓN
// =============================================

/**
 * Middleware que verifica autenticación en requests
 */
export async function authenticateRequest(request: NextRequest): Promise<{
  authenticated: boolean
  user?: AuthenticatedUser
  error?: string
}> {
  try {
    // Bypass explícito solo para testing local/staging no productivo
    const bypassUser = getBypassUserFromRequest(request)
    if (bypassUser) {
      return {
        authenticated: true,
        user: bypassUser
      }
    }

    // Extraer token
    const token = extractToken(request)
    if (!token) {
      return {
        authenticated: false,
        error: 'Token de autenticación requerido'
      }
    }

    // Verificar token
    const payload = verifyToken(token)
    if (!payload) {
      return {
        authenticated: false,
        error: 'Token de autenticación inválido'
      }
    }

    // Verificar que el usuario sigue activo
  const user = await getUserById(payload.id, payload.userType)
    if (!user) {
      return {
        authenticated: false,
        error: 'Usuario no encontrado o inactivo'
      }
    }

    return {
      authenticated: true,
      user
    }

  } catch (error) {
    logger.error('Authentication middleware error', error as Error, {
      component: 'auth-middleware',
      metadata: {
        method: request.method,
        path: new URL(request.url).pathname
      }
    })
    return {
      authenticated: false,
      error: 'Error interno de autenticación'
    }
  }
}

// =============================================
// AUTORIZACIÓN POR ROLES
// =============================================

/**
 * Verifica si un usuario tiene los permisos necesarios
 */
export function hasPermission(
  userRole: string,
  requiredRoles: string[]
): boolean {
  return requiredRoles.includes(userRole)
}

/**
 * Middleware que verifica autorización por roles
 */
export function requireRoles(allowedRoles: string[]) {
  return async function(request: NextRequest): Promise<{
    authorized: boolean
    user?: AuthenticatedUser
    error?: string
  }> {
    // Primero autenticar
    const authResult = await authenticateRequest(request)

    if (!authResult.authenticated || !authResult.user) {
      return {
        authorized: false,
        error: authResult.error || 'No autenticado'
      }
    }

    // Verificar permisos
    if (!hasPermission(authResult.user.role, allowedRoles)) {
      return {
        authorized: false,
        error: 'No tienes permisos para realizar esta acción'
      }
    }

    return {
      authorized: true,
      user: authResult.user
    }
  }
}

// =============================================
// MIDDLEWARES ESPECÍFICOS
// =============================================

/**
 * Middleware solo para administradores
 */
export const requireAdmin = requireRoles([USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN])

/**
 * Middleware para gestores de técnicos y administradores
 */
export const requireTechnicianManager = requireRoles([
  USER_ROLES.SUPER_ADMIN,
  USER_ROLES.ADMIN,
  USER_ROLES.TECHNICIAN_MANAGER
])

/**
 * Middleware que permite cualquier usuario autenticado
 */
export const requireAuth = requireRoles([
  USER_ROLES.SUPER_ADMIN,
  USER_ROLES.ADMIN,
  USER_ROLES.TECHNICIAN_MANAGER,
  USER_ROLES.VIEWER,
  USER_ROLES.CUSTOMER
])

// =============================================
// UTILIDADES DE RESPUESTA
// =============================================

/**
 * Genera respuesta de error de autenticación
 */
export function unauthorizedResponse(message = 'No autorizado'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message
    },
    { status: 401 }
  )
}

/**
 * Genera respuesta de error de autorización
 */
export function forbiddenResponse(message = 'Acceso denegado'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message
    },
    { status: 403 }
  )
}

/**
 * Genera respuesta de éxito con datos del usuario
 */
export function authenticatedResponse(user: AuthenticatedUser, data?: unknown): NextResponse {
  return NextResponse.json({
    success: true,
    user,
    data
  })
}

// =============================================
// WRAPPER PARA RUTAS PROTEGIDAS
// =============================================

/**
 * HOC que protege rutas de API con autenticación
 */
export function withAuth(
  handler: (request: NextRequest, user: AuthenticatedUser, ...args: any[]) => Promise<NextResponse>
) {
  return async function(request: NextRequest, ...args: any[]): Promise<NextResponse> {
    const authResult = await authenticateRequest(request)

    if (!authResult.authenticated || !authResult.user) {
      return unauthorizedResponse(authResult.error)
    }

    return handler(request, authResult.user, ...args)
  }
}

/**
 * HOC que protege rutas de API con autorización por roles
 */
export function withRoles(
  allowedRoles: string[],
  handler: (request: NextRequest, user: AuthenticatedUser, ...args: any[]) => Promise<NextResponse>
) {
  return async function(request: NextRequest, ...args: any[]): Promise<NextResponse> {
    const authCheck = requireRoles(allowedRoles)
    const authResult = await authCheck(request)

    if (!authResult.authorized || !authResult.user) {
      if (authResult.error?.includes('No tienes permisos')) {
        return forbiddenResponse(authResult.error)
      }
      return unauthorizedResponse(authResult.error)
    }

    return handler(request, authResult.user, ...args)
  }
}

/**
 * Obtiene el usuario actual desde las cookies (Server Components)
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value || cookieStore.get('token')?.value

  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  return getUserById(payload.id, payload.userType)
}

// =============================================
// SESIONES Y REFRESH TOKENS
// =============================================

/**
 * Genera un refresh token (válido por más tiempo)
 */
export function generateRefreshToken(userId: number, userType: 'admin' | 'customer'): string {
  return jwt.sign(
    { userId, userType, type: 'refresh' },
    JWT_SECRET,
    {
      expiresIn: '7d',
      issuer: 'servicio-tecnico-app'
    }
  )
}

/**
 * Verifica un refresh token
 */
export function verifyRefreshToken(token: string): { userId: number; userType: 'admin' | 'customer' } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'servicio-tecnico-app'
    })

    if (typeof decoded !== 'object' || decoded === null) {
      return null
    }

    const payload = decoded as JwtPayload & {
      type?: string
      userId?: number
      userType?: 'admin' | 'customer'
    }

    if (
      payload.type !== 'refresh' ||
      typeof payload.userId !== 'number' ||
      (payload.userType !== 'admin' && payload.userType !== 'customer')
    ) {
      return null
    }

    return { userId: payload.userId, userType: payload.userType }
  } catch {
    return null
  }
}

/**
 * Invalida un token (logout)
 * Nota: En producción sería mejor usar una blacklist en Redis
 */
export async function invalidateToken(token: string): Promise<boolean> {
  // Por ahora solo verificamos que el token sea válido
  // En producción agregaríamos el token a una blacklist
  const payload = verifyToken(token)
  return payload !== null
}
