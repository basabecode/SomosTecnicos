/**
 * API Route: POST /api/auth/reset-password
 * Restablecer contraseña usando un token válido
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendPasswordChangedEmail } from '@/lib/email/send-password-changed'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, newPassword } = body

    // Validar datos
    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Token y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Validar longitud de contraseña
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Buscar y validar el token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      select: {
        id: true,
        userEmail: true,
        userType: true,
        adminUserId: true,
        customerId: true,
        expiresAt: true,
        used: true,
        ipAddress: true,
        userAgent: true
      }
    })

    // Token no existe
    if (!resetToken) {
      return NextResponse.json(
        { success: false, error: 'Token inválido' },
        { status: 404 }
      )
    }

    // Token ya fue usado
    if (resetToken.used) {
      return NextResponse.json(
        { success: false, error: 'Este enlace ya fue utilizado' },
        { status: 400 }
      )
    }

    // Token expirado
    const now = new Date()
    if (resetToken.expiresAt < now) {
      return NextResponse.json(
        { success: false, error: 'Este enlace ha expirado. Solicita uno nuevo.' },
        { status: 400 }
      )
    }

    // Hashear la nueva contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Variable para almacenar el nombre del usuario
    let userName = ''

    // Actualizar la contraseña según el tipo de usuario
    if (resetToken.userType === 'admin' && resetToken.adminUserId) {
      const adminUser = await prisma.adminUser.update({
        where: { id: resetToken.adminUserId },
        data: { passwordHash },
        select: { nombre: true, apellido: true }
      })
      userName = `${adminUser.nombre}${adminUser.apellido ? ' ' + adminUser.apellido : ''}`
    } else if (resetToken.userType === 'customer' && resetToken.customerId) {
      const customer = await prisma.customer.update({
        where: { id: resetToken.customerId },
        data: { passwordHash },
        select: { nombre: true, apellido: true }
      })
      userName = `${customer.nombre}${customer.apellido ? ' ' + customer.apellido : ''}`
    } else {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Marcar el token como usado
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: {
        used: true,
        usedAt: now
      }
    })

    console.log(`✅ Contraseña restablecida para: ${resetToken.userEmail} (${resetToken.userType})`)

    // Enviar email de confirmación (no bloqueante)
    sendPasswordChangedEmail({
      to: resetToken.userEmail,
      userName,
      ipAddress: resetToken.ipAddress || undefined,
      userAgent: resetToken.userAgent || undefined
    }).catch(error => {
      console.error('⚠️  Error enviando email de confirmación (no crítico):', error)
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Contraseña actualizada correctamente'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ Error restableciendo contraseña:', error)
    return NextResponse.json(
      { success: false, error: 'Error procesando la solicitud' },
      { status: 500 }
    )
  }
}
