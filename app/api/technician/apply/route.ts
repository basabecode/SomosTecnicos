/**
 * API de Solicitud de Técnicos
 * Endpoint público para que los técnicos envíen sus solicitudes
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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

    let especialidades: string[] = []
    try {
      especialidades = JSON.parse(especialidadesStr)
      if (!Array.isArray(especialidades)) {
        throw new Error('Especialidades debe ser un array')
      }
    } catch (e) {
      console.error('Error parseando especialidades:', e)
      return NextResponse.json(
        { success: false, error: 'Formato de especialidades inválido' },
        { status: 400 }
      )
    }

    const experienciaAnios = experienciaAniosStr ? parseInt(experienciaAniosStr) : undefined

    // Verificar cedula duplicada
    try {
      const existingByCedula = await prisma.technicianApplication.findUnique({
        where: { cedula }
      })

      if (existingByCedula) {
        return NextResponse.json(
          { success: false, error: 'Ya existe una solicitud con esta cédula' },
          { status: 409 }
        )
      }

      const existingByEmail = await prisma.technicianApplication.findUnique({
        where: { email }
      })

      if (existingByEmail) {
        return NextResponse.json(
          { success: false, error: 'Ya existe una solicitud con este email' },
          { status: 409 }
        )
      }
    } catch (dbError) {
      console.error('Error verificando duplicados en DB:', dbError)
      return NextResponse.json(
        { success: false, error: 'Error verificando datos existentes' },
        { status: 500 }
      )
    }

    // Procesar archivo para DB
    let fileBuffer: Buffer
    let mimeType: string

    try {
      const bytes = await documentosFile.arrayBuffer()
      fileBuffer = Buffer.from(bytes)
      mimeType = documentosFile.type || 'application/pdf'
    } catch (fileError) {
      console.error('Error procesando archivo:', fileError)
      return NextResponse.json(
        { success: false, error: 'Error al procesar el archivo. Intente nuevamente.' },
        { status: 500 }
      )
    }

    // Crear solicitud en DB
    let application
    try {
      application = await prisma.technicianApplication.create({
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
          // Almacenar archivo en DB
          // @ts-expect-error - Prisma generates Bytes type which might mismatch with Buffer in strict mode
          documentosData: fileBuffer,
          documentosMimeType: mimeType,
          // Url provisional (se generará dinámicamente o se actualizará)
          documentosUrl: null,
          estado: 'pendiente'
        }
      })

      // Actualizar URL con el ID generado para referencia fácil
      await prisma.technicianApplication.update({
        where: { id: application.id },
        data: { documentosUrl: `/api/technician/documents/${application.id}` }
      })

    } catch (createError) {
      console.error('Error creando solicitud en DB:', createError)
      return NextResponse.json(
        { success: false, error: 'Error guardando la solicitud en base de datos.' },
        { status: 500 }
      )
    }

    // Enviar emails (no bloqueante para el response)
    const confirmationEmail = await sendTechnicianApplicationReceivedEmail(email, nombre)
    if (!confirmationEmail.success) console.error('Error email confirmación:', confirmationEmail.error)

    const adminNotification = await sendNewTechnicianApplicationNotification(ADMIN_EMAIL, {
      nombre,
      apellido,
      email,
      telefono,
      cedula,
      ciudad,
      especialidades,
      zonaPreferida,
      experienciaAnios
    })
    if (!adminNotification.success) console.error('Error email admin:', adminNotification.error)

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

  } catch (error: any) {
    console.error('Error CRÍTICO no manejado en API technician/apply:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error interno del servidor no especificado'
      },
      { status: 500 }
    )
  }
}
