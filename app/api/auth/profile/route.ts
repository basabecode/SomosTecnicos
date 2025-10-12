import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedUser } from '@/lib/auth'

/**
 * API para obtener perfil del usuario autenticado
 * GET /api/auth/profile
 */

export async function GET(request: NextRequest) {
  return withAuth(async (req: NextRequest, user: AuthenticatedUser) => {
    try {
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          role: user.role,
          activo: user.activo
        }
      })
    } catch (error) {
      console.error('Error obteniendo perfil:', error)
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }
  })(request)
}
