/**
 * API para rechazar solicitudes de técnicos
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRoles } from '@/lib/auth'
import { USER_ROLES } from '@/lib/constants'
import { sendSimpleEmail } from '@/lib/email'

async function handler(
  request: NextRequest,
  user: any,
  context: { params: { id: string } }
) {
  try {
    const applicationId = context.params.id
    const body = await request.json()
    const { motivo } = body

    if (!motivo || motivo.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Debe proporcionar un motivo de rechazo (mínimo 10 caracteres)'
        },
        { status: 400 }
      )
    }

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

    // Actualizar solicitud
    await prisma.technicianApplication.update({
      where: { id: applicationId },
      data: {
        estado: 'rechazado',
        motivoRechazo: motivo,
        revisadoPor: user.id,
        fechaRevision: new Date()
      }
    })

    // Enviar email al solicitante
    await sendSimpleEmail(
      application.email,
      'Actualización de Solicitud - TecnoCity',
      `
        <h2>Hola ${application.nombre},</h2>
        <p>Gracias por tu interés en unirte a TecnoCity.</p>

        <p>Después de revisar tu solicitud, lamentamos informarte que en este momento no podemos continuar con el proceso.</p>

        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #991b1b;">Motivo:</h3>
          <p style="margin: 0;">${motivo}</p>
        </div>

        <p>Te animamos a seguir desarrollando tus habilidades y experiencia. Podrás aplicar nuevamente en el futuro.</p>

        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>

        <p>Saludos cordiales,<br>
        <strong>Equipo TecnoCity</strong></p>
      `
    )

    return NextResponse.json({
      success: true,
      message: 'Solicitud rechazada'
    })

  } catch (error) {
    console.error('Error rechazando solicitud:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al rechazar solicitud'
      },
      { status: 500 }
    )
  }
}

export const POST = withRoles(
  [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN_MANAGER],
  handler as any
)
