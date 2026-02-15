import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting storage (in-memory for Edge runtime)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetAt < now) {
      rateLimitMap.delete(key)
    }
  }
}, 10 * 60 * 1000)

export async function middleware(request: NextRequest) {
  // Skip rate limiting for static assets and internal paths
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next()
  }

  // Get client IP
  const ip = request.ip || 
             request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown'

  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute window
  
  // Different limits for different endpoints
  const limits: Record<string, number> = {
    '/api/orders': 20,           // 20 requests per minute for order creation
    '/api/customer/register': 10, // 10 requests per minute for registration
    '/api/orders/[id]/assign': 15, // 15 requests per minute for assignments
    'default': 100               // 100 requests per minute for other APIs
  }

  // Determine rate limit for this path
  let limit = limits.default
  for (const [path, pathLimit] of Object.entries(limits)) {
    if (path !== 'default' && request.nextUrl.pathname.startsWith(path)) {
      limit = pathLimit
      break
    }
  }

  const key = `${ip}:${request.nextUrl.pathname}`
  const rateLimitInfo = rateLimitMap.get(key)

  if (rateLimitInfo && rateLimitInfo.resetAt > now) {
    if (rateLimitInfo.count >= limit) {
      // Rate limit exceeded
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `Too many requests. Limit: ${limit} requests per minute.`,
          retryAfter: Math.ceil((rateLimitInfo.resetAt - now) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitInfo.resetAt.toString(),
            'Retry-After': Math.ceil((rateLimitInfo.resetAt - now) / 1000).toString()
          }
        }
      )
    }
    
    rateLimitInfo.count++
  } else {
    // Create new rate limit window
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowMs
    })
  }

  // Add rate limit headers to response
  const response = NextResponse.next()
  const currentInfo = rateLimitMap.get(key)!
  
  response.headers.set('X-RateLimit-Limit', limit.toString())
  response.headers.set('X-RateLimit-Remaining', Math.max(0, limit - currentInfo.count).toString())
  response.headers.set('X-RateLimit-Reset', currentInfo.resetAt.toString())

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}