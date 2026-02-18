
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth.authenticated || !['admin', 'super_admin', 'technician_manager'].includes(auth.user?.role || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obtener todas las zonas activas para agrupar o filtrar si es necesario
    // Pero por ahora traemos todos los tecnicos activos

    const technicians = await prisma.technician.findMany({
      where: {
        activo: true
      },
      select: {
        id: true,
        nombre: true,
        calificacionPromedio: true,
        especialidades: true,
        // @ts-ignore
        estadoActual: true, // Nuevo campo
        disponible: true,
        ciudad: true,
        zonaTrabajoArea: true,
        ordenesCompletadas: true
      }
    })

    // Calcular estadísticas
    const stats = {
      total: technicians.length,
      // @ts-ignore
      disponibles: technicians.filter(t => t.estadoActual === 'disponible').length,
      // @ts-ignore
      ocupados: technicians.filter(t => t.estadoActual === 'ocupado').length,
      // @ts-ignore
      descanso: technicians.filter(t => t.estadoActual === 'en_descanso').length,
      // @ts-ignore
      offline: technicians.filter(t => t.estadoActual === 'offline').length
    }

    return NextResponse.json({
      success: true,
      technicians: technicians.map((t: any) => ({
        id: t.id,
        name: t.nombre,
        rating: Number(t.calificacionPromedio),
        specialties: Array.isArray(t.especialidades) ? t.especialidades : ['General'],
        status: t.estadoActual || (t.disponible ? 'disponible' : 'ocupado'), // Fallback
        disponible: t.disponible,
        city: t.ciudad || 'Sin asignar'
      })),
      stats
    })

  } catch (error) {
    console.error('Error fetching technicians availability:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
