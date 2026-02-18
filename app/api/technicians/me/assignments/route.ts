import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { USER_ROLES } from '@/lib/constants'

// GET /api/technicians/me/assignments
export async function GET(request: NextRequest) {
  try {
    // 1. Autenticar usuario
    const authResult = await authenticateRequest(request)
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { user } = authResult

    // 2. Verificar rol de técnico
    if (user.role !== 'technician' && user.role !== 'technician_manager' && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    // 3. Buscar el perfil de técnico asociado al email
    // Esta es la conexión crítica que faltaba
    const technician = await prisma.technician.findUnique({
      where: { email: user.email }
    })

    if (!technician) {
      return NextResponse.json({
        success: false,
        error: 'No se encontró un perfil de técnico asociado a esta cuenta. Contacte soporte.'
      }, { status: 404 })
    }

    // 4. Obtener asignaciones
    const url = new URL(request.url)
    const status = url.searchParams.get('status') // Filtro opcional

    const whereClause: any = {
      technicianId: technician.id
    }

    if (status) {
      whereClause.estado = status
    }

    const assignments = await prisma.assignment.findMany({
      where: whereClause,
      include: {
        order: true, // Incluir detalles de la orden
        visitReports: true // Incluir reportes de visita para detalles de cierre
      },
      orderBy: {
        fechaProgramada: 'asc'
      }
    })

    // 5. Calcular estadísticas rápidas para el dashboard
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const stats = {
      pending: assignments.filter(a => a.estado === 'asignado' || a.estado === 'en_camino').length,
      inProgress: assignments.filter(a => a.estado === 'en_proceso').length,
      completedToday: assignments.filter(a => {
        return a.estado === 'completado' && a.fechaCompletada && new Date(a.fechaCompletada) >= today
      }).length
    }

    return NextResponse.json({
      success: true,
      technician: {
        id: technician.id,
        nombre: technician.nombre,
        especialidades: technician.especialidades,
        zona: technician.zonaTrabajoArea
      },
      assignments: assignments.map(a => {
        const report = a.visitReports?.[0]
        return {
          id: a.id,
          orderNumber: a.order.orderNumber,
          orderId: a.order.id,
          cliente: a.order.nombre,
          telefono: a.order.telefono,
          direccion: a.order.direccion,
          distrito: a.order.ciudad,
          tipoElectrodomestico: a.order.tipoElectrodomestico,
          problema: a.order.descripcionProblema,
          urgencia: a.order.urgencia,
          fechaProgramada: a.fechaProgramada,
          fechaCompletada: a.fechaCompletada,
          estado: a.estado,
          notas: a.notasAsignacion,
          // Campos adicionales para historial
          duration: a.tiempoReal ? `${(a.tiempoReal / 60).toFixed(1)} horas` : 'N/A',
          earnings: report?.costoTotal ? Number(report.costoTotal) : 0,
          parts: report?.repuestos ? (report.repuestos as any[]).map((r: any) => r.nombre) : [],
          rating: 5, // Placeholder ya que no existe campo de calificación por orden en el esquema actual
          clientFeedback: report?.recomendaciones || '', // Usamos recomendaciones como proxy o dejamos vacío
          priority: a.order.urgencia === 'alta' ? 'high' : a.order.urgencia === 'media' ? 'medium' : a.order.urgencia === 'baja' ? 'low' : 'urgent'
        }
      }),
      stats
    })

  } catch (error) {
    console.error('Error fetching technician assignments:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
