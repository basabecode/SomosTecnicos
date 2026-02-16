import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { QuoteForm } from '@/components/technician/quote-form'
import { ORDER_STATES, USER_ROLES } from '@/lib/constants'

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  const { id } = await params

  if (!user) {
    redirect('/auth/login')
  }

  // Verificar si es técnico o admin
  const isTechnician = user.role !== USER_ROLES.CUSTOMER

  if (!isTechnician) {
    redirect('/unauthorized')
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      assignments: true
    }
  })

  if (!order) {
    notFound()
  }

  // Verificar si la orden está en estado correcto para cotizar
  // Solo se puede cotizar si está en REVISADO o ASIGNADO o EN_CAMINO (flexibilidad)
  // Pero idealmente debería ser REVISADO.
  const allowedStates = [ORDER_STATES.REVISADO, ORDER_STATES.EN_CAMINO, ORDER_STATES.ASIGNADO, ORDER_STATES.PENDIENTE]

  if (!allowedStates.includes(order.estado as any)) {
     // Si ya está cotizado o en proceso, redirigir al detalle
     redirect(`/technician/assignments`)
  }

  return (
    <QuoteForm
      orderId={order.id}
      orderNumber={order.orderNumber}
      clientName={order.nombre}
      appliance={`${order.tipoElectrodomestico} ${order.marca || ''} ${order.modelo || ''}`.trim()}
      serviceType={order.tipoServicio}
      initialProblem={order.descripcionProblema || ''}
    />
  )
}
