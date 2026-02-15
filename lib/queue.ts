/**
 * Sistema de Colas para operaciones asíncronas
 * Utiliza Vercel Queue para manejar operaciones lentas fuera del request principal
 */

import { logger } from '@/lib/logger'

// Tipos para los jobs de la cola
export interface EmailJob {
  type: 'email'
  to: string
  subject: string
  template: string
  data: Record<string, any>
  priority?: number
}

export interface NotificationJob {
  type: 'notification' 
  userId: string
  title: string
  message: string
  type_notification: 'assignment' | 'status_change' | 'reminder'
  priority?: number
}

export interface PDFJob {
  type: 'pdf'
  orderId: string
  template: 'invoice' | 'report'
  data: Record<string, any>
  priority?: number
}

export interface AuditJob {
  type: 'audit'
  action: string
  userId: string
  metadata: Record<string, any>
  priority?: number
}

export type Job = EmailJob | NotificationJob | PDFJob | AuditJob

// Configuración de las colas
const QUEUE_CONFIG = {
  maxRetries: 3,
  retryBackoff: 'exponential' as const,
  timeout: 30000, // 30 segundos
}

// Simulación del sistema de colas (para desarrollo)
// En producción, esto sería reemplazado por Vercel Queue real
class QueueManager {
  private queues: Map<string, Job[]> = new Map()
  private processing: Set<string> = new Set()

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
  async enqueue(job: Job, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<void> {
    const jobWithMeta = {
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
  private async processQueue(priority: string) {
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
  private async processJob(job: Job & { id: string; attempts: number; enqueuedAt: Date }) {
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
    // TODO: Integrar con servicio de email (Brevo, SendGrid, etc.)
    logger.info(`Sending email to ${job.to}: ${job.subject}`)
    
    // Simulación de envío de email
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Aquí iría la integración real:
    // await emailService.send({
    //   to: job.to,
    //   subject: job.subject,
    //   template: job.template,
    //   data: job.data
    // })
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
export async function enqueueEmail(job: Omit<EmailJob, 'type'>, priority: 'high' | 'medium' | 'low' = 'medium') {
  await queueManager.enqueue({ ...job, type: 'email' }, priority)
}

export async function enqueueNotification(job: Omit<NotificationJob, 'type'>, priority: 'high' | 'medium' | 'low' = 'high') {
  await queueManager.enqueue({ ...job, type: 'notification' }, priority)
}

export async function enqueuePDF(job: Omit<PDFJob, 'type'>, priority: 'high' | 'medium' | 'low' = 'low') {
  await queueManager.enqueue({ ...job, type: 'pdf' }, priority)
}

export async function enqueueAudit(job: Omit<AuditJob, 'type'>, priority: 'high' | 'medium' | 'low' = 'low') {
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