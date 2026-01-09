/**
 * API para aprobar solicitudes de técnicos
 * Crea usuario en admin_users y técnico en technicians
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRoles, hashPassword } from '@/lib/auth'
import { USER_ROLES } from '@/lib/constants'
import { sendSimpleEmail } from '@/lib/email'

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
    await sendSimpleEmail(
      application.email,
      '🎉 Solicitud Aprobada - Bienvenido a TecnoCity',
      `
        <h2>¡Felicitaciones ${application.nombre}!</h2>
        <p>Tu solicitud para unirte a TecnoCity ha sido <strong>aprobada</strong>.</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">🔑 Tus Credenciales de Acceso</h3>
          <p><strong>Usuario:</strong> ${username}</p>
          <p><strong>Contraseña temporal:</strong> ${tempPassword}</p>
          <p><strong>URL de acceso:</strong> <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login">${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login</a></p>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>⚠️ Importante:</strong> Por seguridad, cambia tu contraseña al iniciar sesión por primera vez.</p>
        </div>

        <h3>📋 Próximos Pasos:</h3>
        <ol>
          <li>Inicia sesión con tus credenciales</li>
          <li>Cambia tu contraseña temporal</li>
          <li>Completa tu perfil</li>
          <li>Revisa tu panel de técnico</li>
          <li>Espera asignaciones de servicio</li>
        </ol>

        <p>¡Bienvenido al equipo de TecnoCity!</p>
      `
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
