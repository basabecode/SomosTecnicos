/**
 * API Route: POST /api/auth/forgot-password
 * Solicitud de recuperación de contraseña
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email/send-password-reset'

// Rate limiting simple (en producción usar Redis o similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = requestCounts.get(ip)

  if (!limit || now > limit.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + 3600000 }) // 1 hora
    return true
  }

  if (limit.count >= 3) {
    return false // Máximo 3 intentos por hora
  }

  limit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validar email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Demasiados intentos. Intenta de nuevo en 1 hora.' },
        { status: 429 }
      )
    }

    // Buscar usuario (Admin o Customer)
    const emailLower = email.toLowerCase()

    const [adminUser, customer] = await Promise.all([
      prisma.adminUser.findUnique({
        where: { email: emailLower },
        select: { id: true, email: true, nombre: true, apellido: true }
      }),
      prisma.customer.findUnique({
        where: { email: emailLower },
        select: { id: true, email: true, nombre: true, apellido: true }
      })
    ])

    // Por seguridad, siempre respondemos con éxito (no revelamos si el email existe)
    const successResponse = {
      success: true,
      message: 'Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.'
    }

    // Si el usuario no existe, responder con éxito pero no hacer nada
    if (!adminUser && !customer) {
      console.log(`⚠️  Intento de recuperación para email no registrado: ${emailLower}`)
      return NextResponse.json(successResponse, { status: 200 })
    }

    const user = adminUser || customer
    const userType = adminUser ? 'admin' : 'customer'
    const userName = user!.nombre + (user!.apellido ? ` ${user!.apellido}` : '')

    // Invalidar tokens anteriores del usuario
    await prisma.passwordResetToken.updateMany({
      where: {
        userEmail: emailLower,
        used: false,
        expiresAt: { gt: new Date() }
      },
      data: { used: true, usedAt: new Date() }
    })

    // Crear nuevo token
    const expiresAt = new Date(Date.now() + 3600000) // 1 hora
    const userAgent = request.headers.get('user-agent') || undefined

    const resetToken = await prisma.passwordResetToken.create({
      data: {
        userEmail: emailLower,
        userType,
        adminUserId: adminUser?.id,
        customerId: customer?.id,
        expiresAt,
        ipAddress: ip,
        userAgent
      }
    })

    // Enviar email
    const emailResult = await sendPasswordResetEmail({
      to: user!.email,
      userName,
      resetToken: resetToken.token
    })

    if (!emailResult.success) {
      console.error('❌ Error enviando email:', emailResult.error)
      // No revelamos el error al usuario por seguridad
    } else {
      console.log(`✅ Email de recuperación enviado a: ${emailLower} (${userType})`)
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('❌ Error en forgot-password:', error)
    return NextResponse.json(
      { success: false, error: 'Error procesando la solicitud' },
      { status: 500 }
    )
  }
}
