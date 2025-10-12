import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

/**
 * API para buscar órdenes por número de orden
 * GET /api/orders/search?numeroOrden=12345
 *
 * @description Permite a los clientes buscar sus órdenes usando el número de orden
 * @returns Datos básicos de la orden y estado actual
 */

const searchQuerySchema = z.object({
  numeroOrden: z.string().min(1, 'Número de orden requerido')
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())

    // Validar parámetros de búsqueda
    const { numeroOrden } = searchQuerySchema.parse(query)

    // Buscar la orden por número de orden
    const orden = await prisma.order.findFirst({
      where: {
        orderNumber: numeroOrden
      },
      select: {
        id: true,
        orderNumber: true,
        estado: true,
        createdAt: true,
        fechaPreferida: true,
        nombre: true,
        telefono: true,
        tipoElectrodomestico: true,
        marca: true,
        modelo: true,
        tipoServicio: true,
        descripcionProblema: true,
        urgencia: true,
        assignments: {
          select: {
            technician: {
              select: {
                id: true,
                nombre: true,
                telefono: true,
                especialidades: true
              }
            },
            estado: true,
            fechaAsignacion: true
          },
          orderBy: {
            fechaAsignacion: 'desc'
          },
          take: 1
        },
        history: {
          select: {
            estadoAnterior: true,
            estadoNuevo: true,
            notas: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    })

    if (!orden) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(orden)

  } catch (error) {
    console.error('Error en búsqueda de orden:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Parámetros de búsqueda inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
