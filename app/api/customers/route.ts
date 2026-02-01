
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth.authenticated || !['admin', 'super_admin', 'technician_manager'].includes(auth.user?.role || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '50'))
    const search = searchParams.get('search') || ''

    const where: any = {}
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { apellido: { contains: search, mode: 'insensitive' } } // Verificamos si apellido existe en schema
      ]
    }

    // Customer tiene nombre, apellido, email
    const customers = await prisma.customer.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        ciudad: true,
        direccion: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            createdAt: true,
            estado: true
          }
        },
        _count: {
          select: { orders: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      customers: customers.map((c: any) => {
        const lastOrder = c.orders[0]
        return {
          ...c,
          nombreCompleto: `${c.nombre} ${c.apellido || ''}`.trim(),
          ultimaSolicitud: lastOrder ? lastOrder.createdAt : null,
          totalOrdenes: c._count.orders
        }
      })
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
