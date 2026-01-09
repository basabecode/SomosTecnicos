/**
 * API de Solicitud de Técnicos
 * Endpoint público para que los técnicos envíen sus solicitudes
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateAndTransform, technicianApplicationSchema } from '@/lib/validations'
import {
  sendTechnicianApplicationReceivedEmail,
  sendNewTechnicianApplicationNotification
} from '@/lib/email'

// Email del administrador (puedes moverlo a variables de entorno)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin.demo@tecnocity.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos de entrada
    const validation = validateAndTransform(technicianApplicationSchema, body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos de solicitud inválidos',
          details: validation.errors.errors
        },
        { status: 400 }
      )
    }

    const data = validation.data

    // Verificar si ya existe una solicitud con la misma cédula
    const existingByCedula = await prisma.technicianApplication.findUnique({
      where: { cedula: data.cedula }
    })

    if (existingByCedula) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ya existe una solicitud con esta cédula'
        },
        { status: 409 }
      )
    }

    // Verificar si ya existe una solicitud con el mismo email
    const existingByEmail = await prisma.technicianApplication.findUnique({
      where: { email: data.email }
    })

    if (existingByEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ya existe una solicitud con este email'
        },
        { status: 409 }
      )
    }

    // Crear la solicitud en la base de datos
    const application = await prisma.technicianApplication.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        cedula: data.cedula,
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,
        ciudad: data.ciudad,
        especialidades: data.especialidades,
        zonaPreferida: data.zonaPreferida,
        experienciaAnios: data.experienciaAnios,
        estado: 'pendiente'
      }
    })

    // Enviar email de confirmación al solicitante
    const confirmationEmail = await sendTechnicianApplicationReceivedEmail(
      data.email,
      data.nombre
    )

    if (!confirmationEmail.success) {
      console.error('Error enviando email de confirmación:', confirmationEmail.error)
    }

    // Enviar notificación al administrador
    const adminNotification = await sendNewTechnicianApplicationNotification(
      ADMIN_EMAIL,
      {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
        cedula: data.cedula,
        ciudad: data.ciudad,
        especialidades: data.especialidades,
        zonaPreferida: data.zonaPreferida,
        experienciaAnios: data.experienciaAnios
      }
    )

    if (!adminNotification.success) {
      console.error('Error enviando notificación al admin:', adminNotification.error)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Solicitud enviada exitosamente. Recibirás una respuesta en 24-48 horas.',
        applicationId: application.id,
        emailsSent: {
          confirmation: confirmationEmail.success,
          adminNotification: adminNotification.success
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error procesando solicitud de técnico:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor al procesar la solicitud'
      },
      { status: 500 }
    )
  }
}
