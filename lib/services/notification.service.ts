/**
 * Servicio de Notificaciones
 * Maneja el envío de emails, SMS y notificaciones push, además de persistir notificaciones In-App
 */

import { prisma } from '@/lib/prisma'
import { NOTIFICATION_TYPES } from '@/lib/constants'

interface NotificationPayload {
  userId: string        // ID del usuario destinatario
  userType: string      // 'admin', 'customer', 'technician'
  to: string           // email o identificador
  subject?: string
  message: string
  type: keyof typeof NOTIFICATION_TYPES
  orderId?: string
  metadata?: Record<string, any>
}

/**
 * Envía una notificación por el canal especificado
 */
export async function sendNotification(payload: NotificationPayload): Promise<boolean> {
  try {
     // 1. Persistir en Base de Datos (In-App)
     await prisma.notification.create({
       data: {
         userId: payload.userId,
         userType: payload.userType,
         destinatario: payload.to,
         asunto: payload.subject,
         mensaje: payload.message,
         tipo: payload.type,
         canal: 'system', // Por defecto para in-app
         orderId: payload.orderId,
         metadata: payload.metadata || {},
         enviado: true,
         fechaEnvio: new Date()
       }
     })

     // 2. MOCK: Envío externo (Email/SMS)
     console.log(`\n🔔 [${payload.type.toUpperCase()}] To: ${payload.to}`)
     if (payload.subject) console.log(`   Subject: ${payload.subject}`)
     console.log(`   Message: ${payload.message}`)
     console.log('----------------------------------------\n')

     return true
  } catch (error) {
     console.error('Error al enviar/guardar notificación:', error)
     return false
  }
}

/**
 * Marcar notificación como leída
 */
export async function markAsRead(notificationId: number) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true }
  })
}

/**
 * Notificar cambio de estado de orden
 */
export async function notifyOrderStateChange(
  order: any,
  previousState: string,
  newState: string
) {
  const message = `Su orden #${order.orderNumber} ha cambiado de estado: ${previousState} -> ${newState}`

  await sendNotification({
    userId: order.customerId?.toString() || '0',
    userType: 'customer',
    to: order.email,
    subject: `Actualización de Orden #${order.orderNumber}`,
    message,
    type: 'EMAIL',
    orderId: order.id,
    metadata: { orderId: order.id, newState }
  })
}

/**
 * Notificar asignación a técnico
 */
export async function notifyAssignment(
  technician: any,
  order: any
) {
  await sendNotification({
    userId: technician.id.toString(),
    userType: 'technician',
    to: technician.email,
    subject: `Nueva Asignación: Orden #${order.orderNumber}`,
    message: `Se te ha asignado la orden #${order.orderNumber}. Cliente: ${order.nombre}`,
    type: 'SYSTEM', // Usamos SYSTEM para notificaciones internas prioritarias
    orderId: order.id,
    metadata: {
      orderId: order.id,
      technicianId: technician.id,
      link: `/technician/assignments?orderId=${order.id}`
    }
  })
}
