/**
 * API Eliminar Cuenta de Cliente
 * DELETE /api/customer/account
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedUser, verifyPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const DELETE = withAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    if (user.userType !== 'customer') {
      return NextResponse.json(
        { success: false, error: 'Solo los clientes pueden eliminar su cuenta desde aquí' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Debes confirmar tu contraseña para eliminar la cuenta' },
        { status: 400 }
      )
    }

    // Verificar contraseña antes de eliminar
    const customer = await prisma.customer.findUnique({
      where: { id: user.id },
      select: { passwordHash: true }
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Cuenta no encontrada' },
        { status: 404 }
      )
    }

    const isValid = await verifyPassword(password, customer.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta' },
        { status: 400 }
      )
    }

    // Eliminar la cuenta (cascade elimina orders, notifications, tokens)
    await prisma.customer.delete({
      where: { id: user.id }
    })

    // Limpiar cookies de sesión en la respuesta
    const response = NextResponse.json({
      success: true,
      message: 'Cuenta eliminada correctamente'
    })
    response.cookies.delete('auth-token')
    response.cookies.delete('refreshToken')

    return response
  } catch (error) {
    console.error('Error eliminando cuenta de cliente:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
