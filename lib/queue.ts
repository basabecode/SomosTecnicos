/**
 * Sistema de Colas para operaciones asíncronas
 * Utiliza Vercel Queue para manejar operaciones lentas fuera del request principal
 */

import { logger } from '@/lib/logger'

// Tipos para los jobs de la cola
export type QueuePriority = 'high' | 'medium' | 'low'

export interface EmailJob {
  type: 'email'
  to: string
  subject: string
  template: string
  data: Record<string, any>
}

export interface NotificationJob {
  type: 'notification'
  userId: string
  title: string
  message: string
  type_notification: 'assignment' | 'status_change' | 'reminder'
}

export interface PDFJob {
  type: 'pdf'
  orderId: string
  template: 'invoice' | 'report'
  data: Record<string, any>
}

export interface AuditJob {
  type: 'audit'
  action: string
  userId: string
  metadata: Record<string, any>
}

export type Job = EmailJob | NotificationJob | PDFJob | AuditJob

// Configuración de las colas
const QUEUE_CONFIG = {
  maxRetries: 3,
  retryBackoff: 'exponential' as const,
  timeout: 30000, // 30 segundos
}

// Tipo interno del job con metadatos
type QueuedJob = Job & {
  id: string
  enqueuedAt: Date
  attempts: number
  priority: QueuePriority
}

// Simulación del sistema de colas (para desarrollo)
// En producción, esto sería reemplazado por Vercel Queue real
class QueueManager {
  private queues: Map<QueuePriority, QueuedJob[]> = new Map()
  private processing: Set<QueuePriority> = new Set()

  constructor() {
    // Inicializar colas
    this.queues.set('high', [])
    this.queues.set('medium', [])
    this.queues.set('low', [])

    // Procesador en background
    this.startProcessor()
  }

  /**
   * Agregar job a la cola
   */
  async enqueue(job: Job, priority: QueuePriority = 'medium'): Promise<void> {
    const jobWithMeta: QueuedJob = {
      ...job,
      id: `${job.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      enqueuedAt: new Date(),
      attempts: 0,
      priority
    }

    const queue = this.queues.get(priority)
    if (queue) {
      queue.push(jobWithMeta)
      logger.info(`Job enqueued: ${jobWithMeta.id} (${job.type}) - Priority: ${priority}`)
    } else {
      throw new Error(`Queue ${priority} not found`)
    }
  }

  /**
   * Procesador de colas en background
   */
  private startProcessor() {
    setInterval(async () => {
      await this.processQueue('high')
      await this.processQueue('medium')
      await this.processQueue('low')
    }, 1000) // Procesar cada segundo
  }

  /**
   * Procesar jobs de una cola específica
   */
  private async processQueue(priority: QueuePriority) {
    if (this.processing.has(priority)) {
      return // Ya está procesando esta cola
    }

    const queue = this.queues.get(priority)
    if (!queue || queue.length === 0) {
      return // Cola vacía
    }

    this.processing.add(priority)

    try {
      const job = queue.shift()
      if (job) {
        await this.processJob(job as any)
      }
    } catch (error) {
      logger.error(`Error processing queue ${priority}:`, error as Error)
    } finally {
      this.processing.delete(priority)
    }
  }

  /**
   * Procesar un job individual
   */
  private async processJob(job: QueuedJob) {
    try {
      logger.info(`Processing job: ${job.id} (${job.type})`)

      switch (job.type) {
        case 'email':
          await this.processEmailJob(job as EmailJob)
          break
        case 'notification':
          await this.processNotificationJob(job as NotificationJob)
          break
        case 'pdf':
          await this.processPDFJob(job as PDFJob)
          break
        case 'audit':
          await this.processAuditJob(job as AuditJob)
          break
        default:
          throw new Error(`Unknown job type: ${(job as any).type}`)
      }

      logger.info(`Job completed: ${job.id}`)
    } catch (error) {
      job.attempts++

      if (job.attempts < QUEUE_CONFIG.maxRetries) {
        // Reencolar con backoff exponencial
        const delay = Math.pow(2, job.attempts) * 1000 // 2^attempts * 1000ms
        setTimeout(() => {
          const queue = this.queues.get(job.priority || 'medium')
          if (queue) {
            queue.push(job)
            logger.warn(`Job requeued: ${job.id} (attempt ${job.attempts}/${QUEUE_CONFIG.maxRetries})`)
          }
        }, delay)
      } else {
        logger.error(`Job failed permanently: ${job.id}`, error as Error, {
          component: 'queue-processor',
          metadata: {
            jobType: job.type,
            attempts: job.attempts,
            enqueuedAt: job.enqueuedAt
          }
        })
      }
    }
  }

  /**
   * Procesadores específicos por tipo de job
   */
  private async processEmailJob(job: EmailJob): Promise<void> {
    try {
      const { sendNewOrderEmail, sendStatusUpdateEmail, sendTechnicianAssignmentEmail, sendCustomerAssignmentEmail, sendTechnicianApplicationReceivedEmail, sendTechnicianApprovedEmail, sendNewTechnicianApplicationNotification, sendSimpleEmail } = await import('./email')

      logger.info(`Sending email to ${job.to}: ${job.subject} [Template: ${job.template}]`)

      let result;

      switch (job.template) {
        case 'technician-assignment':
          result = await sendTechnicianAssignmentEmail({
             technicianName: job.data.technicianName,
             technicianEmail: job.to, // Assuming job.to is the technician email
             orderNumber: job.data.orderNumber,
             customerName: job.data.customerName,
             address: job.data.address,
             appliance: job.data.appliance,
             scheduledDate: job.data.scheduledDate,
             notes: job.data.notes
          });
          break;
        case 'customer-technician-assigned':
          result = await sendCustomerAssignmentEmail({
            customerName: job.data.customerName,
            customerEmail: job.to,
            orderNumber: job.data.orderNumber,
            technicianName: job.data.technicianName,
            technicianPhone: job.data.technicianPhone,
            appliance: job.data.appliance,
            scheduledDate: job.data.scheduledDate
          });
          break;
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
          });
          break;
        case 'status-update':
          result = await sendStatusUpdateEmail({
              orderNumber: job.data.orderNumber,
              customerName: job.data.customerName,
              customerEmail: job.to,
              status: job.data.newStatus,
              // Required fields for type safety, even if unused in this specific template logic
              customerPhone: '',
              serviceType: '',
              applianceType: '',
              description: '',
              address: '',
              preferredDate: '',
              notes: job.data.notes,
              technicianName: job.data.technicianName,
              technicianPhone: job.data.technicianPhone
          });
          break;
        case 'technician-application-received':
            result = await sendTechnicianApplicationReceivedEmail(job.to, job.data.applicantName);
            break;
        case 'technician-approved':
            result = await sendTechnicianApprovedEmail(job.to, job.data.technicianName, job.data.username, job.data.tempPassword);
            break;
        case 'new-technician-application-notification':
            result = await sendNewTechnicianApplicationNotification(job.to, job.data.applicationData);
            break;
        default:
          // Fallback generic email
          result = await sendSimpleEmail(job.to, job.subject, JSON.stringify(job.data, null, 2));
      }

      if (!result.success) {
          throw new Error(result.error);
      }

      logger.info(`Email sent successfully: ${result.messageId}`);
    } catch (error) {
       console.error('Failed to process email job', error);
       throw error;
    }
  }

  private async processNotificationJob(job: NotificationJob): Promise<void> {
    logger.info(`Sending notification to user ${job.userId}: ${job.title}`)

    // Simulación de notificación push
    await new Promise(resolve => setTimeout(resolve, 300))

    // Aquí iría la integración real:
    // await notificationService.send({
    //   userId: job.userId,
    //   title: job.title,
    //   message: job.message,
    //   type: job.type_notification
    // })
  }

  private async processPDFJob(job: PDFJob): Promise<void> {
    logger.info(`Generating PDF for order ${job.orderId}`)

    // Simulación de generación de PDF
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Aquí iría la generación real:
    // await pdfService.generate({
    //   orderId: job.orderId,
    //   template: job.template,
    //   data: job.data
    // })
  }

  private async processAuditJob(job: AuditJob): Promise<void> {
    logger.audit(job.action, job.userId, job.metadata)
  }

  /**
   * Obtener estadísticas de las colas
   */
  getQueueStats() {
    return {
      high: this.queues.get('high')?.length || 0,
      medium: this.queues.get('medium')?.length || 0,
      low: this.queues.get('low')?.length || 0,
      processing: Array.from(this.processing),
      total: Array.from(this.queues.values()).reduce((sum, queue) => sum + queue.length, 0)
    }
  }
}

// Instancia singleton del queue manager
const queueManager = new QueueManager()

// Funciones públicas para usar en la aplicación
export async function enqueueEmail(job: Omit<EmailJob, 'type'>, priority: QueuePriority = 'medium') {
  await queueManager.enqueue({ ...job, type: 'email' }, priority)
}

export async function enqueueNotification(job: Omit<NotificationJob, 'type'>, priority: QueuePriority = 'high') {
  await queueManager.enqueue({ ...job, type: 'notification' }, priority)
}

export async function enqueuePDF(job: Omit<PDFJob, 'type'>, priority: QueuePriority = 'low') {
  await queueManager.enqueue({ ...job, type: 'pdf' }, priority)
}

export async function enqueueAudit(job: Omit<AuditJob, 'type'>, priority: QueuePriority = 'low') {
  await queueManager.enqueue({ ...job, type: 'audit' }, priority)
}

export function getQueueStats() {
  return queueManager.getQueueStats()
}

// Helper para API endpoints que necesitan feedback inmediato
export function queueAndRespond<T>(
  response: T,
  queueOperations: Array<() => Promise<void>>
): { response: T; queued: boolean } {
  // Ejecutar operaciones en background sin bloquear la respuesta
  Promise.all(queueOperations.map(op => op().catch(error => {
    logger.error('Background queue operation failed:', error as Error)
  })))

  return {
    response,
    queued: true
  }
}
