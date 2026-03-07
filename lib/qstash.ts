/**
 * Cliente Upstash QStash — Cola de trabajos persistente y durable para serverless
 *
 * QStash garantiza entrega de jobs aunque la función serverless termine antes
 * de procesar el trabajo. Usa HTTP como transporte, sin conexiones persistentes.
 *
 * Configuración en Vercel:
 *   QSTASH_URL       → Dashboard Upstash > QStash > Details
 *   QSTASH_TOKEN     → Dashboard Upstash > QStash > Tokens
 *   QSTASH_CURRENT_SIGNING_KEY  → para verificar webhooks
 *   QSTASH_NEXT_SIGNING_KEY     → para rotación de claves
 *
 * Flujo:
 *   1. Route Handler → qstash.publishJSON() → Upstash guarda el job
 *   2. Upstash llama → POST /api/queue/process con el payload del job
 *   3. El webhook procesa el job (email, PDF, notificación)
 */

import { Client, Receiver } from '@upstash/qstash'
import { logger } from '@/lib/logger'
import type { EmailJob, NotificationJob, PDFJob, AuditJob, QueuePriority } from '@/lib/queue'

// ─── Cliente QStash ─────────────────────────────────────────────────────────

function getQStashClient(): Client | null {
  if (!process.env.QSTASH_TOKEN) {
    return null // QStash no configurado — usar fallback síncrono
  }
  return new Client({ token: process.env.QSTASH_TOKEN })
}

// URL interna del webhook procesador de jobs
function getProcessorUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return `${base}/api/queue/process`
}

// ─── Publicar jobs ──────────────────────────────────────────────────────────

/**
 * Encola un job en QStash. Retorna true si se publicó, false si no hay QStash configurado.
 */
async function publishJob(
  job: EmailJob | NotificationJob | PDFJob | AuditJob,
  priority: QueuePriority = 'medium'
): Promise<boolean> {
  const client = getQStashClient()
  if (!client) return false

  try {
    // Delay según prioridad: high=0s, medium=0s, low=5s
    const delay = priority === 'low' ? 5 : 0

    await client.publishJSON({
      url: getProcessorUrl(),
      body: job,
      retries: 3,
      delay,
      headers: {
        'x-job-priority': priority,
        'x-job-type': job.type
      }
    })

    logger.info(`QStash job enqueued: ${job.type} (priority: ${priority})`)
    return true
  } catch (error) {
    logger.error('Error publicando job en QStash:', error as Error, {
      component: 'qstash',
      metadata: { jobType: job.type, priority }
    })
    return false
  }
}

// ─── Funciones públicas ──────────────────────────────────────────────────────

export async function qstashEmail(
  job: Omit<EmailJob, 'type'>,
  priority: QueuePriority = 'medium'
): Promise<boolean> {
  return publishJob({ ...job, type: 'email' }, priority)
}

export async function qstashNotification(
  job: Omit<NotificationJob, 'type'>,
  priority: QueuePriority = 'high'
): Promise<boolean> {
  return publishJob({ ...job, type: 'notification' }, priority)
}

export async function qstashPDF(
  job: Omit<PDFJob, 'type'>,
  priority: QueuePriority = 'low'
): Promise<boolean> {
  return publishJob({ ...job, type: 'pdf' }, priority)
}

export async function qstashAudit(
  job: Omit<AuditJob, 'type'>,
  priority: QueuePriority = 'low'
): Promise<boolean> {
  return publishJob({ ...job, type: 'audit' }, priority)
}

// ─── Verificación de firma de webhook ────────────────────────────────────────

/**
 * Verifica que el webhook viene de Upstash QStash y no de un tercero.
 * Usar en POST /api/queue/process antes de procesar el job.
 */
export async function verifyQStashSignature(request: Request): Promise<boolean> {
  const signingKey = process.env.QSTASH_CURRENT_SIGNING_KEY
  const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY

  if (!signingKey) {
    // Sin claves configuradas: solo permitir en desarrollo
    if (process.env.NODE_ENV === 'development') return true
    logger.warn('QStash signing keys no configuradas en producción')
    return false
  }

  try {
    const receiver = new Receiver({
      currentSigningKey: signingKey,
      nextSigningKey: nextSigningKey || signingKey
    })

    const body = await request.text()
    const signature = request.headers.get('Upstash-Signature') || ''

    const isValid = await receiver.verify({
      signature,
      body,
      url: getProcessorUrl()
    })

    return isValid
  } catch {
    return false
  }
}

export { getQStashClient }
