/**
 * API de Solicitud de Técnicos
 * Endpoint público para que los técnicos envíen sus solicitudes
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import {
  sendTechnicianApplicationReceivedEmail,
  sendNewTechnicianApplicationNotification
} from '@/lib/email'

// Email del administrador (puedes moverlo a variables de entorno)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin.demo@somostecnicos.com'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extraer datos del formulario
    const nombre = formData.get('nombre') as string
    const apellido = formData.get('apellido') as string
    const cedula = formData.get('cedula') as string
    const email = formData.get('email') as string
    const telefono = formData.get('telefono') as string
    const direccion = formData.get('direccion') as string
    const ciudad = formData.get('ciudad') as string
    const especialidadesStr = formData.get('especialidades') as string
    const zonaPreferida = formData.get('zonaPreferida') as string
    const experienciaAniosStr = formData.get('experienciaAnios') as string | null
    const documentosFile = formData.get('documentos') as File | null

    // Validaciones básicas
    if (!nombre || !apellido || !cedula || !email || !telefono || !direccion || !ciudad || !especialidadesStr || !zonaPreferida) {
      return NextResponse.json(
        {
          success: false,
          error: 'Todos los campos obligatorios deben ser completados'
        },
        { status: 400 }
      )
    }

    if (!documentosFile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Debe cargar el archivo de documentos (cédula y certificados)'
        },
        { status: 400 }
      )
    }

    // Validar que sea PDF
    if (documentosFile.type !== 'application/pdf') {
      return NextResponse.json(
        {
          success: false,
          error: 'El archivo debe ser un PDF'
        },
        { status: 400 }
      )
    }

    // Validar tamaño (1MB)
    if (documentosFile.size > 1048576) {
      return NextResponse.json(
        {
          success: false,
          error: 'El archivo debe pesar menos de 1MB'
        },
        { status: 400 }
      )
    }

    const especialidades = JSON.parse(especialidadesStr)
    const experienciaAnios = experienciaAniosStr ? parseInt(experienciaAniosStr) : undefined

    // Verificar si ya existe una solicitud con la misma cédula
    const existingByCedula = await prisma.technicianApplication.findUnique({
      where: { cedula }
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
      where: { email }
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

    // Guardar el archivo
    const bytes = await documentosFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Crear directorio si no existe
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'technician-docs')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Nombre único para el archivo
    const timestamp = Date.now()
    const fileName = `${cedula}_${timestamp}.pdf`
    const filePath = join(uploadDir, fileName)
    const publicPath = `/uploads/technician-docs/${fileName}`

    await writeFile(filePath, buffer)

    // Crear la solicitud en la base de datos
    const application = await prisma.technicianApplication.create({
      data: {
        nombre,
        apellido,
        cedula,
        email,
        telefono,
        direccion,
        ciudad,
        especialidades,
        zonaPreferida,
        experienciaAnios,
        ...(publicPath && { documentosUrl: publicPath }), // Agregar solo si existe
        estado: 'pendiente'
      }
    })

    // Enviar email de confirmación al solicitante
    const confirmationEmail = await sendTechnicianApplicationReceivedEmail(
      email,
      nombre
    )

    if (!confirmationEmail.success) {
      console.error('Error enviando email de confirmación:', confirmationEmail.error)
    }

    // Enviar notificación al administrador
    const adminNotification = await sendNewTechnicianApplicationNotification(
      ADMIN_EMAIL,
      {
        nombre,
        apellido,
        email,
        telefono,
        cedula,
        ciudad,
        especialidades,
        zonaPreferida,
        experienciaAnios
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
