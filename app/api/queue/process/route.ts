/**
 * Webhook receptor de Upstash QStash
 * POST /api/queue/process
 *
 * QStash llama a este endpoint para cada job encolado.
 * Verifica la firma de Upstash antes de procesar.
 * Retorna 200 para marcar el job como exitoso, o 500 para que QStash reintente.
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyQStashSignature } from '@/lib/qstash'
import { logger } from '@/lib/logger'
import type { Job } from '@/lib/queue'

export const runtime = 'nodejs' // Necesita Node.js para Prisma y email

export async function POST(request: NextRequest) {
  // 1. Verificar firma QStash (evita llamadas no autorizadas)
  const clonedReq = request.clone()
  const isValid = await verifyQStashSignature(clonedReq)
  if (!isValid) {
    logger.warn('QStash webhook con firma inválida rechazado', {
      component: 'queue-processor',
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    } as any)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let job: Job
  try {
    job = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const jobType = job.type
  logger.info(`QStash processing job: ${jobType}`)

  try {
    switch (jobType) {
      case 'email':
        await processEmailJob(job)
        break
      case 'notification':
        await processNotificationJob(job)
        break
      case 'pdf':
        await processPDFJob(job)
        break
      case 'audit':
        await processAuditJob(job)
        break
      default:
        logger.warn(`QStash: tipo de job desconocido: ${(job as any).type}`)
        // Retornar 200 para no reintentar jobs de tipo inválido
        return NextResponse.json({ success: true, skipped: true })
    }

    logger.info(`QStash job completado: ${jobType}`)
    return NextResponse.json({ success: true })

  } catch (error) {
    logger.error(`QStash job fallido: ${jobType}`, error as Error, {
      component: 'queue-processor',
      metadata: { jobType }
    })
    // 500 → QStash reintentará hasta 3 veces con backoff exponencial
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

// ─── Procesadores ─────────────────────────────────────────────────────────────

async function processEmailJob(job: any) {
  const {
    sendNewOrderEmail,
    sendStatusUpdateEmail,
    sendTechnicianAssignmentEmail,
    sendCustomerAssignmentEmail,
    sendTechnicianApplicationReceivedEmail,
    sendTechnicianApprovedEmail,
    sendNewTechnicianApplicationNotification,
    sendSimpleEmail
  } = await import('@/lib/email')

  let result: { success: boolean; messageId?: string; error?: string }

  switch (job.template) {
    case 'technician-assignment':
      result = await sendTechnicianAssignmentEmail({
        technicianName: job.data.technicianName,
        technicianEmail: job.to,
        orderNumber: job.data.orderNumber,
        customerName: job.data.customerName,
        address: job.data.address,
        appliance: job.data.appliance,
        scheduledDate: job.data.scheduledDate,
        notes: job.data.notes
      })
      break
    case 'customer-technician-assigned':
      result = await sendCustomerAssignmentEmail({
        customerName: job.data.customerName,
        customerEmail: job.to,
        orderNumber: job.data.orderNumber,
        technicianName: job.data.technicianName,
        technicianPhone: job.data.technicianPhone,
        appliance: job.data.appliance,
        scheduledDate: job.data.scheduledDate
      })
      break
    case 'new-order':
      result = await sendNewOrderEmail({
        orderNumber: job.data.orderNumber,
        customerName: job.data.customerName,
        customerEmail: job.to,
        customerPhone: job.data.customerPhone || '',
        serviceType: job.data.serviceType || '',
        applianceType: job.data.applianceType || '',
        description: job.data.description || '',
        address: job.data.address || '',
        preferredDate: job.data.preferredDate || '',
        status: 'pendiente'
      })
      break
    case 'status-update':
      result = await sendStatusUpdateEmail({
        orderNumber: job.data.orderNumber,
        customerName: job.data.customerName,
        customerEmail: job.to,
        status: job.data.newStatus,
        customerPhone: '',
        serviceType: '',
        applianceType: '',
        description: '',
        address: '',
        preferredDate: '',
        notes: job.data.notes,
        technicianName: job.data.technicianName,
        technicianPhone: job.data.technicianPhone
      })
      break
    case 'technician-application-received':
      result = await sendTechnicianApplicationReceivedEmail(job.to, job.data.applicantName)
      break
    case 'technician-approved':
      result = await sendTechnicianApprovedEmail(
        job.to,
        job.data.technicianName,
        job.data.username,
        job.data.tempPassword
      )
      break
    case 'new-technician-application-notification':
      result = await sendNewTechnicianApplicationNotification(job.to, job.data.applicationData)
      break
    default:
      result = await sendSimpleEmail(job.to, job.subject, JSON.stringify(job.data, null, 2))
  }

  if (!result.success) {
    throw new Error(result.error || 'Email send failed')
  }

  logger.info(`Email enviado: ${result.messageId}`)
}

async function processNotificationJob(job: any) {
  const { sendNotification } = await import('@/lib/services/notification.service')

  await sendNotification({
    userId: job.userId,
    userType: 'admin',
    to: job.userId,
    subject: job.title,
    message: job.message,
    type: 'SYSTEM',
    metadata: { source: 'qstash', notificationType: job.type_notification }
  })
}

async function processPDFJob(job: any) {
  // TODO INC-10: Implementar generación real de PDFs
  logger.warn(`PDF job pendiente de implementación — orderId: ${job.orderId}, template: ${job.template}`)
  throw new Error('PDF generation not implemented yet')
}

async function processAuditJob(job: any) {
  const { logger: appLogger } = await import('@/lib/logger')
  appLogger.audit(job.action, job.userId, job.metadata)
}
