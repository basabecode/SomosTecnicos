/**
 * API para aprobar solicitudes de técnicos
 * Crea usuario en admin_users y técnico en technicians
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRoles, hashPassword } from '@/lib/auth'
import { USER_ROLES } from '@/lib/constants'
import { sendTechnicianApprovedEmail } from '@/lib/email'

async function handler(
  request: NextRequest,
  user: any,
  context: { params: Promise<{ id: string }> } // Corregir tipo para Next.js 15+
) {
  try {
    const { id: applicationId } = await context.params // Await params

    // Obtener la solicitud
    const application = await prisma.technicianApplication.findUnique({
      where: { id: applicationId }
    })

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          error: 'Solicitud no encontrada'
        },
        { status: 404 }
      )
    }

    if (application.estado !== 'pendiente') {
      return NextResponse.json(
        {
          success: false,
          error: 'Esta solicitud ya fue procesada'
        },
        { status: 400 }
      )
    }

    // Generar credenciales
    let username = application.email.split('@')[0].toLowerCase()

    // Verificar si el username existe y ajustar si es necesario
    const existingUser = await prisma.adminUser.findUnique({ where: { username } })
    if (existingUser) {
      username = `${username}${Math.floor(Math.random() * 1000)}`
    }

    const tempPassword = `Tecno${Math.random().toString(36).substring(2, 8)}!`
    const passwordHash = await hashPassword(tempPassword)

    // Usar transacción para asegurar consistencia
    await prisma.$transaction(async (tx) => {
      // 1. Crear usuario en admin_users
      await tx.adminUser.create({
        data: {
          username,
          email: application.email,
          passwordHash,
          nombre: application.nombre,
          apellido: application.apellido,
          telefono: application.telefono,
          role: 'technician',
          activo: true
        }
      })

      // 2. Crear técnico en technicians
      // Verificar si ya existe técnico con esa cédula o email para evitar error 500
      const existingTech = await tx.technician.findFirst({
        where: {
          OR: [
            { email: application.email },
            { cedula: application.cedula },
            { telefono: application.telefono }
          ]
        }
      })

      if (existingTech) {
        throw new Error(`Ya existe un técnico con esos datos (Email, Cédula o Teléfono)`)
      }

      await tx.technician.create({
        data: {
          nombre: `${application.nombre} ${application.apellido}`,
          email: application.email,
          telefono: application.telefono,
          cedula: application.cedula,
          especialidades: application.especialidades as any,
          zonaTrabajoArea: application.zonaPreferida,
          activo: true,
          disponible: true
        }
      })

      // 3. Actualizar solicitud
      await tx.technicianApplication.update({
        where: { id: applicationId },
        data: {
          estado: 'aprobado',
          revisadoPor: user.id,
          fechaRevision: new Date()
        }
      })
    })

    // Enviar email fuera de la transacción para no bloquear
    try {
      await sendTechnicianApprovedEmail(
        application.email,
        `${application.nombre} ${application.apellido}`,
        username,
        tempPassword
      )
    } catch (emailError) {
      console.error('Error enviando email de aprobación:', emailError)
      // No fallamos el request si el email falla, pero lo logueamos
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitud aprobada exitosamente',
      credentials: {
        username,
        tempPassword
      }
    })

  } catch (error: any) {
    console.error('Error aprobando solicitud:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al aprobar solicitud'
      },
      { status: 500 }
    )
  }
}

export const POST = withRoles(
  [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN_MANAGER],
  handler as any
)
