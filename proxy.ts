import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// =============================================
// CONFIGURACIÓN DE RUTAS PROTEGIDAS
// =============================================

const PROTECTED_ROUTES = [
  {
    prefix: '/customer',
    roles: ['customer'],
    redirect: '/customer/dashboard',
  },
  {
    prefix: '/technician',
    roles: ['technician', 'technician_manager'],
    redirect: '/technician/dashboard',
  },
  {
    prefix: '/admin',
    roles: ['admin', 'super_admin', 'technician_manager', 'viewer'],
    redirect: '/admin/dashboard',
  },
]

// Rutas que nunca deben protegerse
const PUBLIC_PATHS = ['/login', '/register', '/api/auth', '/_next', '/static', '/favicon']

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(p => pathname.startsWith(p)) || pathname.includes('.')
}

// =============================================
// VERIFICACIÓN JWT (Edge-compatible con jose)
// =============================================

async function verifyToken(token: string): Promise<{ role: string; userType: string } | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return {
      role: (payload.role as string) || (payload.userType as string) || '',
      userType: (payload.userType as string) || '',
    }
  } catch {
    return null
  }
}

// =============================================
// RATE LIMITING (conservado del middleware original)
// =============================================

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetAt < now) rateLimitMap.delete(key)
  }
}, 10 * 60 * 1000)

const RATE_LIMITS: Record<string, number> = {
  '/api/orders': 20,
  '/api/customer/register': 10,
  '/api/orders/[id]/assign': 15,
  default: 100,
}

function applyRateLimit(request: NextRequest): NextResponse | null {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'

  const now = Date.now()
  const windowMs = 60 * 1000
  const pathname = request.nextUrl.pathname

  let limit = RATE_LIMITS.default
  for (const [path, pathLimit] of Object.entries(RATE_LIMITS)) {
    if (path !== 'default' && pathname.startsWith(path)) {
      limit = pathLimit
      break
    }
  }

  const key = `${ip}:${pathname}`
  const info = rateLimitMap.get(key)

  if (info && info.resetAt > now) {
    if (info.count >= limit) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `Too many requests. Limit: ${limit} per minute.`,
          retryAfter: Math.ceil((info.resetAt - now) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': info.resetAt.toString(),
            'Retry-After': Math.ceil((info.resetAt - now) / 1000).toString(),
          },
        }
      )
    }
    info.count++
  } else {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
  }

  return null
}

// =============================================
// PROXY PRINCIPAL (Next.js 16 — renombrado de middleware)
// =============================================

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Rutas públicas y assets — pasar sin verificar
  if (isPublicPath(pathname)) {
    // Aplicar rate limiting solo en rutas API públicas (ej: /api/auth)
    if (pathname.startsWith('/api/')) {
      const rateLimitResponse = applyRateLimit(request)
      if (rateLimitResponse) return rateLimitResponse
    }
    return NextResponse.next()
  }

  // 2. Verificar si la ruta requiere protección por rol
  const matchedRoute = PROTECTED_ROUTES.find(r => pathname.startsWith(r.prefix))

  if (matchedRoute) {
    const token =
      request.cookies.get('auth-token')?.value ||
      request.cookies.get('token')?.value

    // Sin token → redirigir a login preservando la ruta de destino
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verificar token y rol
    const user = await verifyToken(token)

    if (!user) {
      // Token inválido o expirado → limpiar cookie y redirigir
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('auth-token')
      response.cookies.delete('refreshToken')
      return response
    }

    const hasRole = matchedRoute.roles.includes(user.role)

    if (!hasRole) {
      // Autenticado pero sin el rol correcto → redirigir a su portal
      const correctPortal = PROTECTED_ROUTES.find(r => r.roles.includes(user.role))
      const redirectUrl = correctPortal
        ? new URL(correctPortal.redirect, request.url)
        : new URL('/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Autenticado y con rol correcto → continuar
    return NextResponse.next()
  }

  // 3. Rutas API — solo rate limiting
  if (pathname.startsWith('/api/')) {
    const rateLimitResponse = applyRateLimit(request)
    if (rateLimitResponse) return rateLimitResponse

    const response = NextResponse.next()
    const key = `${request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'}:${pathname}`
    const info = rateLimitMap.get(key)
    if (info) {
      const limit = RATE_LIMITS.default
      response.headers.set('X-RateLimit-Limit', limit.toString())
      response.headers.set('X-RateLimit-Remaining', Math.max(0, limit - info.count).toString())
      response.headers.set('X-RateLimit-Reset', info.resetAt.toString())
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Portales protegidos
    '/customer/:path*',
    '/technician/:path*',
    '/admin/:path*',
    // API routes para rate limiting
    '/api/:path*',
  ],
}
