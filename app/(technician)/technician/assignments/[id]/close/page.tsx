import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { CloseServiceForm } from '@/components/technician/close-service-form'
import { ORDER_STATES, USER_ROLES } from '@/lib/constants'
import { getCostoVisitaTecnica } from '@/lib/order-utils'

export default async function CloseServicePage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Verificar si es técnico o admin
  const isTechnician = user.role !== USER_ROLES.CUSTOMER

  if (!isTechnician) {
    redirect('/unauthorized')
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      assignments: true
    }
  })

  if (!order) {
    notFound()
  }

  // Verificar estado
  // Se puede cerrar desde: REVISADO (no reparable), EN_PROCESO (reparado), REAGENDADO (seguimiento)
  // COTIZADO no debería cerrarse sin aprobación (o rechazo) del cliente, pero si el cliente rechaza se cierra solo.
  // Así que COTIZADO no es un estado válido para entrar aquí manualmente desde UI técnico a menos que quiera forzar cierre.
  // Vamos a permitir REVISADO (salto directo a no reparable) y EN_PROCESO.
  const allowedStates = [
    ORDER_STATES.REVISADO,
    ORDER_STATES.EN_PROCESO,
    ORDER_STATES.ESPERANDO_REPUESTOS,
    ORDER_STATES.ASIGNADO, // Flexibilidad
    ORDER_STATES.EN_CAMINO
  ]

  if (!allowedStates.includes(order.estado as any)) {
     // Si ya está completado/cancelado, redirigir
     redirect(`/technician/assignments`)
  }

  const costoVisita = await getCostoVisitaTecnica()

  return (
    <CloseServiceForm
      orderId={order.id}
      orderNumber={order.orderNumber}
      clientName={order.nombre}
      appliance={`${order.tipoElectrodomestico} ${order.marca || ''} ${order.modelo || ''}`.trim()}
      initialCost={Number(order.costoEstimado) || Number(order.costoFinal) || undefined} // Si ya tenía costo estimado, úsalo como base
      visitCost={costoVisita}
    />
  )
}
