/**
 * Sistema de Notificaciones por Email
 * Integración con Resend para envío de emails automáticos
 */

import { Resend } from 'resend'

// =============================================
// CONFIGURACIÓN
// =============================================

const resend = new Resend(process.env.RESEND_API_KEY!)

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@tecnocity.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// =============================================
// TIPOS
// =============================================

interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceType: string
  applianceType: string
  description: string
  address: string
  preferredDate: string
  status: string
  technicianName?: string
  technicianPhone?: string
  estimatedCost?: number
  notes?: string
}

interface NotificationResult {
  success: boolean
  messageId?: string
  error?: string
}

// =============================================
// PLANTILLAS DE EMAIL
// =============================================

/**
 * Plantilla HTML para nueva orden
 */
function getNewOrderTemplate(data: OrderEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Nueva Orden de Servicio - TecnoCity</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #A50034; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { background: #A50034; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔧 TecnoCity</h1>
                <h2>Confirmación de Servicio</h2>
            </div>

            <div class="content">
                <h3>¡Hola ${data.customerName}!</h3>
                <p>Hemos recibido tu solicitud de servicio técnico. Aquí están los detalles:</p>

                <div class="order-details">
                    <h4>📋 Detalles del Servicio</h4>
                    <p><strong>Número de Orden:</strong> ${data.orderNumber}</p>
                    <p><strong>Tipo de Servicio:</strong> ${data.serviceType}</p>
                    <p><strong>Electrodoméstico:</strong> ${data.applianceType}</p>
                    <p><strong>Descripción:</strong> ${data.description}</p>
                    <p><strong>Dirección:</strong> ${data.address}</p>
                    <p><strong>Fecha Preferida:</strong> ${data.preferredDate}</p>
                    <p><strong>Estado:</strong> <span style="color: #A50034; font-weight: bold;">${data.status}</span></p>
                </div>

                <p>Nuestro equipo se pondrá en contacto contigo pronto para coordinar la visita.</p>

                <a href="${APP_URL}/seguimiento?order=${data.orderNumber}" class="button">
                    📱 Seguir mi Orden
                </a>

                <p><strong>📞 ¿Necesitas ayuda?</strong><br>
                Llámanos al: <strong>(+57) 300 123 4567</strong><br>
                Email: <strong>soporte@tecnocity.com</strong></p>
            </div>

            <div class="footer">
                <p>© 2025 TecnoCity - Servicio Técnico de Electrodomésticos</p>
                <p>Este es un email automático, no responder directamente.</p>
            </div>
        </div>
    </body>
    </html>
  `
}

/**
 * Plantilla HTML para cambio de estado
 */
function getStatusUpdateTemplate(data: OrderEmailData): string {
  const statusMessages = {
    'pendiente': '⏳ Tu orden está pendiente de asignación',
    'asignada': '👨‍🔧 Tu orden ha sido asignada a un técnico',
    'en_progreso': '🔧 El técnico está trabajando en tu servicio',
    'completada': '✅ Tu servicio ha sido completado exitosamente',
    'cancelada': '❌ Tu orden ha sido cancelada'
  }

  const statusMessage = statusMessages[data.status as keyof typeof statusMessages] || 'Estado actualizado'

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Actualización de Orden - TecnoCity</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #A50034; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .status-update { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #A50034; }
            .technician-info { background: #e8f5e8; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { background: #A50034; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔧 TecnoCity</h1>
                <h2>Actualización de tu Servicio</h2>
            </div>

            <div class="content">
                <h3>¡Hola ${data.customerName}!</h3>

                <div class="status-update">
                    <h4>📢 Estado Actualizado</h4>
                    <p><strong>Orden:</strong> ${data.orderNumber}</p>
                    <p><strong>Nuevo Estado:</strong> <span style="color: #A50034; font-weight: bold;">${data.status}</span></p>
                    <p>${statusMessage}</p>
                    ${data.notes ? `<p><strong>Notas:</strong> ${data.notes}</p>` : ''}
                </div>

                ${data.technicianName ? `
                <div class="technician-info">
                    <h4>👨‍🔧 Información del Técnico</h4>
                    <p><strong>Técnico:</strong> ${data.technicianName}</p>
                    <p><strong>Teléfono:</strong> ${data.technicianPhone}</p>
                    ${data.estimatedCost ? `<p><strong>Costo Estimado:</strong> $${data.estimatedCost.toLocaleString()}</p>` : ''}
                </div>
                ` : ''}

                <a href="${APP_URL}/seguimiento?order=${data.orderNumber}" class="button">
                    📱 Ver Detalles Completos
                </a>

                <p><strong>📞 ¿Preguntas?</strong><br>
                Contáctanos: <strong>(+57) 300 123 4567</strong></p>
            </div>

            <div class="footer">
                <p>© 2025 TecnoCity - Servicio Técnico de Electrodomésticos</p>
            </div>
        </div>
    </body>
    </html>
  `
}

// =============================================
// FUNCIONES DE ENVÍO
// =============================================

/**
 * Envía email de confirmación de nueva orden
 */
export async function sendNewOrderEmail(data: OrderEmailData): Promise<NotificationResult> {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `✅ Confirmación de Servicio - Orden ${data.orderNumber}`,
      html: getNewOrderTemplate(data)
    })

    return {
      success: true,
      messageId: result.data?.id
    }
  } catch (error) {
    console.error('Error enviando email de nueva orden:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Envía email de actualización de estado
 */
export async function sendStatusUpdateEmail(data: OrderEmailData): Promise<NotificationResult> {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `📢 Actualización de Orden ${data.orderNumber} - ${data.status}`,
      html: getStatusUpdateTemplate(data)
    })

    return {
      success: true,
      messageId: result.data?.id
    }
  } catch (error) {
    console.error('Error enviando email de actualización:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Envía notificación simple por email
 */
export async function sendSimpleEmail(
  to: string,
  subject: string,
  message: string
): Promise<NotificationResult> {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #A50034;">🔧 TecnoCity</h2>
          <p>${message}</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            © 2025 TecnoCity - Servicio Técnico de Electrodomésticos
          </p>
        </div>
      `
    })

    return {
      success: true,
      messageId: result.data?.id
    }
  } catch (error) {
    console.error('Error enviando email simple:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Valida configuración de email
 */
export function validateEmailConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!process.env.RESEND_API_KEY) {
    errors.push('RESEND_API_KEY no configurada')
  }

  if (!process.env.FROM_EMAIL) {
    errors.push('FROM_EMAIL no configurada (usando default)')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
