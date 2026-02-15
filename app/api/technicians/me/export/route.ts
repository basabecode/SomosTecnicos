/**
 * API de Exportación de Datos del Técnico
 * GET /api/technicians/me/export - Exporta datos personales del técnico
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

// Función para convertir datos a CSV
function convertToCSV(data: any[], headers: string[]): string {
  const headerRow = headers.join(',')
  const dataRows = data.map(row =>
    headers.map(header => {
      const value = row[header]
      if (value === null || value === undefined) return ''
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }).join(',')
  ).join('\n')

  return `${headerRow}\n${dataRows}`
}

export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    // Verificar que el usuario es un técnico
    if (user.role !== 'technician') {
      return NextResponse.json(
        { success: false, error: 'Acceso denegado' },
        { status: 403 }
      )
    }

    // Obtener el técnico por email
    const technician = await prisma.technician.findUnique({
      where: { email: user.email },
      select: { id: true, nombre: true }
    })

    if (!technician) {
      return NextResponse.json(
        { success: false, error: 'Técnico no encontrado' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'my-services'
    const format = searchParams.get('format') || 'csv'

    let data: any[] = []
    let headers: string[] = []
    let filename = 'mi_reporte'

    // Obtener datos según el tipo
    switch (type) {
      case 'my-services':
        // Exportar servicios del técnico
        const assignments = await prisma.assignment.findMany({
          where: {
            technicianId: technician.id
          },
          take: 500, // Limitar a 500 registros
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            estado: true,
            createdAt: true,
            updatedAt: true,
            order: {
              select: {
                orderNumber: true,
                nombre: true,
                telefono: true,
                ciudad: true,
                direccion: true,
                tipoElectrodomestico: true,
                marca: true,
                modelo: true,
                urgencia: true,
                costoEstimado: true,
                costoFinal: true,
                fechaCompletado: true
              }
            }
          }
        })

        data = assignments.map(assignment => ({
          numeroOrden: assignment.order.orderNumber,
          cliente: assignment.order.nombre,
          telefono: assignment.order.telefono,
          ciudad: assignment.order.ciudad,
          direccion: assignment.order.direccion,
          electrodomestico: assignment.order.tipoElectrodomestico,
          marca: assignment.order.marca || '',
          modelo: assignment.order.modelo || '',
          urgencia: assignment.order.urgencia,
          estado: assignment.estado,
          costoEstimado: assignment.order.costoEstimado ? Number(assignment.order.costoEstimado) : '',
          costoFinal: assignment.order.costoFinal ? Number(assignment.order.costoFinal) : '',
          fechaAsignacion: assignment.createdAt.toISOString().split('T')[0],
          fechaActualizacion: assignment.updatedAt.toISOString().split('T')[0],
          fechaCompletado: assignment.order.fechaCompletado ? assignment.order.fechaCompletado.toISOString().split('T')[0] : ''
        }))

        headers = [
          'numeroOrden', 'cliente', 'telefono', 'ciudad', 'direccion',
          'electrodomestico', 'marca', 'modelo', 'urgencia', 'estado',
          'costoEstimado', 'costoFinal', 'fechaAsignacion', 'fechaActualizacion', 'fechaCompletado'
        ]
        filename = 'mis_servicios'
        break

      case 'my-stats':
        // Exportar estadísticas del técnico
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        const [totalCompleted, monthCompleted, weekCompleted, pending, inProgress] = await Promise.all([
          prisma.assignment.count({
            where: { technicianId: technician.id, estado: 'completado' }
          }),
          prisma.assignment.count({
            where: {
              technicianId: technician.id,
              estado: 'completado',
              updatedAt: { gte: startOfMonth }
            }
          }),
          prisma.assignment.count({
            where: {
              technicianId: technician.id,
              estado: 'completado',
              updatedAt: { gte: startOfWeek }
            }
          }),
          prisma.assignment.count({
            where: { technicianId: technician.id, estado: 'asignado' }
          }),
          prisma.assignment.count({
            where: { technicianId: technician.id, estado: 'en_proceso' }
          })
        ])

        data = [
          { metrica: 'Total Servicios Completados', valor: totalCompleted },
          { metrica: 'Completados Este Mes', valor: monthCompleted },
          { metrica: 'Completados Esta Semana', valor: weekCompleted },
          { metrica: 'Servicios Pendientes', valor: pending },
          { metrica: 'Servicios En Progreso', valor: inProgress }
        ]

        headers = ['metrica', 'valor']
        filename = 'mis_estadisticas'
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Tipo de reporte no válido' },
          { status: 400 }
        )
    }

    // Generar archivo según el formato
    if (format === 'csv') {
      const csv = convertToCSV(data, headers)
      const timestamp = new Date().toISOString().split('T')[0]

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}_${timestamp}.csv"`,
        },
      })
    } else if (format === 'pdf') {
      return NextResponse.json(
        { success: false, error: 'Formato PDF en desarrollo' },
        { status: 501 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Formato no soportado' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error en exportación del técnico:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al generar el reporte',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
})
