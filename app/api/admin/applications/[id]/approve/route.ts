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
  context: { params: { id: string } }
) {
  try {
    const applicationId = context.params.id

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
    const username = application.email.split('@')[0].toLowerCase()
    const tempPassword = `Tecno${Math.random().toString(36).substring(2, 8)}!`
    const passwordHash = await hashPassword(tempPassword)

    // Crear usuario en admin_users
    const adminUser = await prisma.adminUser.create({
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

    // Crear técnico en technicians
    await prisma.technician.create({
      data: {
        nombre: `${application.nombre} ${application.apellido}`,
        email: application.email,
        telefono: application.telefono,
        cedula: application.cedula,
        especialidades: application.especialidades as any, // Prisma Json type handling
        zonaTrabajoArea: application.zonaPreferida,
        activo: true,
        disponible: true
      }
    })

    // Actualizar solicitud
    await prisma.technicianApplication.update({
      where: { id: applicationId },
      data: {
        estado: 'aprobado',
        revisadoPor: user.id,
        fechaRevision: new Date()
      }
    })

    // Enviar email al técnico con credenciales
    await sendTechnicianApprovedEmail(
      application.email,
      `${application.nombre} ${application.apellido}`,
      username,
      tempPassword
    )

    return NextResponse.json({
      success: true,
      message: 'Solicitud aprobada exitosamente',
      credentials: {
        username,
        tempPassword // Solo para mostrar al admin
      }
    })

  } catch (error) {
    console.error('Error aprobando solicitud:', error)

    // Si hay error, intentar revertir cambios
    // (En producción, usar transacciones de base de datos)

    return NextResponse.json(
      {
        success: false,
        error: 'Error al aprobar solicitud'
      },
      { status: 500 }
    )
  }
}

export const POST = withRoles(
  [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN_MANAGER],
  handler as any
)
