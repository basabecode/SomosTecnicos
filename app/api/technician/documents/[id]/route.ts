
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return new NextResponse('ID not provided', { status: 400 })
    }

    const application = await prisma.technicianApplication.findUnique({
      where: { id },
      select: {
        documentosData: true,
        documentosMimeType: true,
        cedula: true
      } as any
    }) as any

    if (!application || !application.documentosData) {
      return new NextResponse('Document not found', { status: 404 })
    }

    // Convertir Bytes a Buffer
    const buffer = Buffer.from(application.documentosData)

    // Configurar headers para descarga/visualización
    const headers = new Headers()
    headers.set('Content-Type', application.documentosMimeType || 'application/pdf')
    headers.set('Content-Disposition', `inline; filename="documentos_${application.cedula}.pdf"`)
    headers.set('Cache-Control', 'private, max-age=3600')

    return new NextResponse(buffer, {
      status: 200,
      headers
    })

  } catch (error) {
    console.error('Error serving technician document:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
