/**
 * API Cambio de Contraseña (usuario autenticado)
 * POST /api/auth/change-password
 * Soporta: admin, customer, technician
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedUser, hashPassword, verifyPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const POST = withAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const body = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body

    // Validaciones básicas
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Las contraseñas nuevas no coinciden' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    if (newPassword === currentPassword) {
      return NextResponse.json(
        { success: false, error: 'La nueva contraseña debe ser diferente a la actual' },
        { status: 400 }
      )
    }

    // Obtener hash actual según tipo de usuario
    let currentHash: string | null = null

    if (user.userType === 'customer') {
      const customer = await prisma.customer.findUnique({
        where: { id: user.id },
        select: { passwordHash: true }
      })
      currentHash = customer?.passwordHash ?? null
    } else {
      // admin y technician (role='technician' vive en AdminUser)
      const adminUser = await prisma.adminUser.findUnique({
        where: { id: user.id },
        select: { passwordHash: true }
      })
      currentHash = adminUser?.passwordHash ?? null
    }

    if (!currentHash) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar contraseña actual
    const isValid = await verifyPassword(currentPassword, currentHash)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'La contraseña actual es incorrecta' },
        { status: 400 }
      )
    }

    // Hashear nueva contraseña
    const newHash = await hashPassword(newPassword)

    // Actualizar en la tabla correspondiente
    if (user.userType === 'customer') {
      await prisma.customer.update({
        where: { id: user.id },
        data: { passwordHash: newHash }
      })
    } else {
      await prisma.adminUser.update({
        where: { id: user.id },
        data: { passwordHash: newHash }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    })
  } catch (error) {
    console.error('Error cambiando contraseña:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
