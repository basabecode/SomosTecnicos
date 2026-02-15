/**
 * API de Exportación de Datos del Dashboard
 * GET /api/dashboard/export - Exporta datos en diferentes formatos
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import { ORDER_STATES } from '@/lib/constants'

// Función para convertir datos a CSV
function convertToCSV(data: any[], headers: string[]): string {
  const headerRow = headers.join(',')
  const dataRows = data.map(row =>
    headers.map(header => {
      const value = row[header]
      // Escapar comillas y envolver en comillas si contiene comas
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

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'stats'
    const format = searchParams.get('format') || 'csv'

    let data: any[] = []
    let headers: string[] = []
    let filename = 'reporte'

    // Obtener datos según el tipo
    switch (type) {
      case 'stats':
        // Exportar estadísticas del dashboard
        const stats = await prisma.order.groupBy({
          by: ['estado'],
          _count: { id: true }
        })

        data = stats.map(item => ({
          estado: item.estado,
          cantidad: item._count.id
        }))
        headers = ['estado', 'cantidad']
        filename = 'estadisticas_dashboard'
        break

      case 'orders':
        // Exportar órdenes
        const orders = await prisma.order.findMany({
          take: 1000, // Limitar a 1000 registros
          orderBy: { createdAt: 'desc' },
          select: {
            orderNumber: true,
            nombre: true,
            telefono: true,
            email: true,
            ciudad: true,
            direccion: true,
            tipoElectrodomestico: true,
            marca: true,
            modelo: true,
            estado: true,
            urgencia: true,
            costoEstimado: true,
            costoFinal: true,
            createdAt: true,
            fechaCompletado: true
          }
        })

        data = orders.map(order => ({
          numeroOrden: order.orderNumber,
          cliente: order.nombre,
          telefono: order.telefono,
          email: order.email || '',
          ciudad: order.ciudad,
          direccion: order.direccion,
          electrodomestico: order.tipoElectrodomestico,
          marca: order.marca || '',
          modelo: order.modelo || '',
          estado: order.estado,
          urgencia: order.urgencia,
          costoEstimado: order.costoEstimado ? Number(order.costoEstimado) : '',
          costoFinal: order.costoFinal ? Number(order.costoFinal) : '',
          fechaCreacion: order.createdAt.toISOString().split('T')[0],
          fechaCompletado: order.fechaCompletado ? order.fechaCompletado.toISOString().split('T')[0] : ''
        }))

        headers = [
          'numeroOrden', 'cliente', 'telefono', 'email', 'ciudad', 'direccion',
          'electrodomestico', 'marca', 'modelo', 'estado', 'urgencia',
          'costoEstimado', 'costoFinal', 'fechaCreacion', 'fechaCompletado'
        ]
        filename = 'ordenes_servicio'
        break

      case 'technicians':
        // Exportar técnicos
        const technicians = await prisma.technician.findMany({
          select: {
            nombre: true,
            telefono: true,
            email: true,
            zonaTrabajoArea: true,
            especialidades: true,
            activo: true,
            disponible: true,
            calificacionPromedio: true,
            ordenesCompletadas: true
          }
        })

        data = technicians.map(tech => ({
          nombre: tech.nombre,
          telefono: tech.telefono,
          email: tech.email,
          zona: tech.zonaTrabajoArea || 'Sin asignar',
          especialidades: Array.isArray(tech.especialidades)
            ? tech.especialidades.join(', ')
            : JSON.stringify(tech.especialidades),
          activo: tech.activo ? 'Sí' : 'No',
          disponible: tech.disponible ? 'Sí' : 'No',
          calificacion: tech.calificacionPromedio ? Number(tech.calificacionPromedio) : '',
          ordenesCompletadas: tech.ordenesCompletadas
        }))

        headers = [
          'nombre', 'telefono', 'email', 'zona', 'especialidades',
          'activo', 'disponible', 'calificacion', 'ordenesCompletadas'
        ]
        filename = 'tecnicos'
        break

      case 'full-report':
        // Reporte completo con resumen
        const [totalOrders, pendingOrders, completedOrders, activeTechs] = await Promise.all([
          prisma.order.count(),
          prisma.order.count({ where: { estado: ORDER_STATES.PENDIENTE } }),
          prisma.order.count({ where: { estado: ORDER_STATES.COMPLETADO } }),
          prisma.technician.count({ where: { activo: true } })
        ])

        data = [
          { metrica: 'Total de Órdenes', valor: totalOrders },
          { metrica: 'Órdenes Pendientes', valor: pendingOrders },
          { metrica: 'Órdenes Completadas', valor: completedOrders },
          { metrica: 'Técnicos Activos', valor: activeTechs }
        ]

        headers = ['metrica', 'valor']
        filename = 'reporte_completo'
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Tipo de reporte no válido' },
          { status: 400 }
        )
    }

    // Generar archivo según el formato
    if (format === 'csv' || format === 'excel') {
      const csv = convertToCSV(data, headers)
      const timestamp = new Date().toISOString().split('T')[0]

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}_${timestamp}.csv"`,
        },
      })
    } else if (format === 'pdf') {
      // Por ahora retornar CSV, implementar PDF en el futuro
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
    console.error('Error en exportación:', error)
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
