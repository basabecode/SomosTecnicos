import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { VisitReportForm } from '@/components/technician/visit-report-form'
import { ORDER_STATES, USER_ROLES } from '@/lib/constants'
import { getCostoVisitaTecnica } from '@/lib/order-utils'

export default async function ExecuteServicePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  const { id } = await params
  const assignmentId = parseInt(id)

  if (!user) {
    redirect('/auth/login')
  }

  if (user.role === USER_ROLES.CUSTOMER) {
    redirect('/unauthorized')
  }

  if (isNaN(assignmentId)) {
    notFound()
  }

  // Buscar asignacion con datos de la orden
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      order: true,
      technician: { select: { id: true, email: true, nombre: true } },
      visitReports: { orderBy: { createdAt: 'desc' }, take: 1 },
    }
  })

  if (!assignment) {
    notFound()
  }

  // Verificar que el tecnico es el asignado (o es admin)
  const isAdmin = user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN
  if (!isAdmin && assignment.technician.email !== user.email) {
    redirect('/unauthorized')
  }

  // Si ya tiene un informe de visita, mostrar un mensaje o redirigir
  if (assignment.visitReports.length > 0) {
    redirect('/technician/assignments')
  }

  // Verificar estado valido para enviar informe
  const allowedStates = [
    ORDER_STATES.ASIGNADO,
    ORDER_STATES.EN_CAMINO,
    ORDER_STATES.EN_PROCESO,
  ]

  if (!allowedStates.includes(assignment.order.estado as any)) {
    redirect('/technician/assignments')
  }

  const costoVisita = await getCostoVisitaTecnica()

  return (
    <VisitReportForm
      orderId={assignment.order.id}
      assignmentId={assignment.id}
      orderNumber={assignment.order.orderNumber}
      clientName={assignment.order.nombre}
      appliance={`${assignment.order.tipoElectrodomestico} ${assignment.order.marca || ''} ${assignment.order.modelo || ''}`.trim()}
      serviceType={assignment.order.tipoServicio}
      initialProblem={assignment.order.descripcionProblema || ''}
      visitCost={costoVisita}
    />
  )
}
