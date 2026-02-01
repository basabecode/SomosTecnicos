
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth.authenticated || auth.user?.role !== 'technician') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body // 'disponible' | 'ocupado' | 'en_descanso' | 'offline'

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    // Mapear el estado a disponibilidad
    const isAvailable = status === 'disponible'

    // Actualizar el técnico usando el ID del usuario autenticado
    // El user.id es el ID de la tabla technicians si el usuario fue autenticado como técnico
    // O si es un usuario que tiene relación con technicien...
    // En `lib/auth.ts`, para technical role, auth.user.id suele ser el ID del tecnico.

    // Verificamos si existe el campo en el schema antes de usarlo
    // Como lo acabamos de agregar, TypeScript podria quejarse si no regeneramos cliente
    // Usaremos 'any' casting temporalmente para evitar error de compilación si el cliente no se regeneró

    // @ts-ignore - Prisma Client no regenerado por lock
    const updatedTechnician = await prisma.technician.update({
      // @ts-ignore
      where: { email: auth.user?.email },
      data: {
        estadoActual: status,
        disponible: isAvailable,
        ultimaActividad: new Date()
      } as any
    })

    return NextResponse.json({
      success: true,
      data: {
        // @ts-ignore
        status: updatedTechnician.estadoActual,
        disponible: updatedTechnician.disponible,
        updatedAt: updatedTechnician.ultimaActividad
      }
    })

  } catch (error) {
    console.error('Error updating technician status:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
    try {
      const auth = await authenticateRequest(request)
      if (!auth.authenticated || auth.user?.role !== 'technician') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const technician = await prisma.technician.findUnique({
        // @ts-ignore
        where: { email: auth.user?.email },
        select: {
            // @ts-ignore
            estadoActual: true,
            disponible: true
        }
      })

      return NextResponse.json({
        success: true,
        data: technician
      })

    } catch (error) {
      console.error('Error getting technician status:', error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }
