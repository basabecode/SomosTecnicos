/**
 * API Eliminar Cuenta de Técnico
 * DELETE /api/technicians/me/account
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, verifyPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
    }

    if (auth.user.role !== 'technician') {
      return NextResponse.json({ success: false, error: 'Acceso denegado' }, { status: 403 })
    }

    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Debes confirmar tu contraseña para eliminar la cuenta' },
        { status: 400 }
      )
    }

    // Verificar contraseña (AdminUser)
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: auth.user.id },
      select: { passwordHash: true }
    })

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Cuenta no encontrada' },
        { status: 404 }
      )
    }

    const isValid = await verifyPassword(password, adminUser.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta' },
        { status: 400 }
      )
    }

    // Desactivar (soft-delete) el técnico en la tabla Technician
    await prisma.technician.updateMany({
      where: { email: auth.user.email },
      data: { activo: false, disponible: false, estadoActual: 'offline' }
    })

    // Desactivar la cuenta AdminUser
    await prisma.adminUser.update({
      where: { id: auth.user.id },
      data: { activo: false }
    })

    const response = NextResponse.json({
      success: true,
      message: 'Cuenta desactivada correctamente'
    })
    response.cookies.delete('auth-token')
    response.cookies.delete('refreshToken')

    return response
  } catch (error) {
    console.error('Error eliminando cuenta del técnico:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
