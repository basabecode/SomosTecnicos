/**
 * Sistema de Notificaciones por Email
 * Integración con Brevo para envío de emails automáticos
 */

import { apiInstance, brevo, defaultSender } from './email/brevo-client'

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
        <title>Nueva Orden de Servicio - SomosTécnicos</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { background: #A50034; color: white; padding: 30px 20px; text-align: center; }
            .header-icon { font-size: 40px; margin-bottom: 10px; }
            .content { padding: 40px 30px; }
            .order-card { background: #f8f9fa; padding: 25px; margin: 20px 0; border-radius: 8px; border: 1px solid #e9ecef; }
            .order-number { color: #A50034; font-size: 24px; font-weight: bold; display: block; margin-top: 5px; }
            .details-list p { margin: 8px 0; border-bottom: 1px solid #eee; padding-bottom: 8px; }
            .details-list p:last-child { border-bottom: none; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; background: #f4f4f4; }
            .button { background: #A50034; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; font-weight: bold; }
            .help-text { font-size: 14px; color: #666; margin-top: 30px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="header-icon">✅</div>
                <h1 style="margin: 0; font-size: 24px;">Confirmación de Servicio</h1>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">SomosTécnicos</p>
            </div>

            <div class="content">
                <h2 style="margin-top: 0; color: #1a1a1a;">Hola ${data.customerName},</h2>
                <p>Hemos recibido tu solicitud correctamente. Un técnico especializado revisará tu caso en breve.</p>

                <div class="order-card">
                    <span style="font-size: 12px; text-transform: uppercase; color: #666; letter-spacing: 1px;">Número de Orden</span>
                    <span class="order-number">${data.orderNumber}</span>

                    <div class="details-list" style="margin-top: 20px;">
                        <p><strong>Servicio:</strong> ${data.serviceType}</p>
                        <p><strong>Electrodoméstico:</strong> ${data.applianceType}</p>
                        <p><strong>Fecha Preferida:</strong> ${data.preferredDate}</p>
                        <p><strong>Dirección:</strong> ${data.address}</p>
                    </div>
                </div>

                <div style="text-align: center;">
                    <a href="${APP_URL}/seguimiento?order=${data.orderNumber}" class="button">
                        Seguir mi Orden
                    </a>
                </div>

                <div class="help-text">
                    <p><strong>¿Necesitas ayuda?</strong><br>
                    Llámanos al: <strong>(+57) 3003094854</strong><br>
                    Email: <strong>soporte@somostecnicos.com</strong></p>
                </div>
            </div>

            <div class="footer">
                <p>© 2026 SomosTécnicos - Servicio Técnico de Electrodomésticos</p>
                <p>Este es un email automático, por favor no responder directamente.</p>
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
        <title>Actualización de Orden - SomosTécnicos</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { background: #A50034; color: white; padding: 30px 20px; text-align: center; }
            .header-icon { font-size: 40px; margin-bottom: 10px; }
            .content { padding: 40px 30px; }
            .status-card { background: #fff5f5; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #A50034; }
            .technician-card { background: #f8f9fa; padding: 20px; margin-top: 20px; border-radius: 8px; border: 1px solid #e9ecef; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; background: #f4f4f4; }
            .button { background: #A50034; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="header-icon">📢</div>
                <h1 style="margin: 0; font-size: 24px;">Actualización de Estado</h1>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">Orden #${data.orderNumber}</p>
            </div>

            <div class="content">
                <h2 style="margin-top: 0; color: #1a1a1a;">Hola ${data.customerName},</h2>

                <div class="status-card">
                    <h3 style="margin: 0 0 10px 0; color: #A50034;">${statusMessage}</h3>
                    <p style="margin: 0;">El estado de tu orden ha cambiado a: <strong>${data.status}</strong></p>
                    ${data.notes ? `<p style="margin-top: 10px; font-style: italic;">"${data.notes}"</p>` : ''}
                </div>

                ${data.technicianName ? `
                <div class="technician-card">
                    <h4 style="margin: 0 0 10px 0;">Datos del Técnico Asignado</h4>
                    <p style="margin: 5px 0;"><strong>Nombre:</strong> ${data.technicianName}</p>
                    <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${data.technicianPhone}</p>
                    ${data.estimatedCost ? `<p style="margin: 5px 0;"><strong>Costo Estimado:</strong> $${data.estimatedCost.toLocaleString()}</p>` : ''}
                </div>
                ` : ''}

                <div style="text-align: center;">
                    <a href="${APP_URL}/seguimiento?order=${data.orderNumber}" class="button">
                        Ver Detalles Completos
                    </a>
                </div>

                <p style="text-align: center; font-size: 14px; color: #666; margin-top: 30px;">
                    ¿Tienes dudas? Llámanos al <strong>(+57) 3003094854</strong>
                </p>
            </div>

            <div class="footer">
                <p>© 2026 SomosTécnicos - Servicio Técnico de Electrodomésticos</p>
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
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.subject = `✅ Confirmación de Servicio - Orden ${data.orderNumber}`
    sendSmtpEmail.htmlContent = getNewOrderTemplate(data)
    sendSmtpEmail.sender = defaultSender
    sendSmtpEmail.to = [{ email: data.customerEmail, name: data.customerName }]

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)

    return {
      success: true,
      messageId: result.body.messageId
    }
  } catch (error: any) {
    console.error('Error enviando email de nueva orden:', error)
    return {
      success: false,
      error: error?.body?.message || error.message || 'Error desconocido'
    }
  }
}

/**
 * Envía email de actualización de estado
 */
export async function sendStatusUpdateEmail(data: OrderEmailData): Promise<NotificationResult> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.subject = `📢 Actualización de Orden ${data.orderNumber} - ${data.status}`
    sendSmtpEmail.htmlContent = getStatusUpdateTemplate(data)
    sendSmtpEmail.sender = defaultSender
    sendSmtpEmail.to = [{ email: data.customerEmail, name: data.customerName }]

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)

    return {
      success: true,
      messageId: result.body.messageId
    }
  } catch (error: any) {
    console.error('Error enviando email de actualización:', error)
    return {
      success: false,
      error: error?.body?.message || error.message || 'Error desconocido'
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
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
            <h2 style="color: #A50034; text-align: center; border-bottom: 2px solid #f4f4f4; padding-bottom: 20px;">🔧 SomosTécnicos</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">${message}</p>
            <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 12px; color: #999;">
              <p>© 2026 SomosTécnicos - Servicio Técnico de Electrodomésticos</p>
            </div>
          </div>
        </div>
      `
    sendSmtpEmail.sender = defaultSender
    sendSmtpEmail.to = [{ email: to }]

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)

    return {
      success: true,
      messageId: result.body.messageId
    }
  } catch (error: any) {
    console.error('Error enviando email simple:', error)
    return {
      success: false,
      error: error?.body?.message || error.message || 'Error desconocido'
    }
  }
}

/**
 * Envía confirmación de recepción de solicitud al técnico
 */
export async function sendTechnicianApplicationReceivedEmail(
  applicantEmail: string,
  applicantName: string
): Promise<NotificationResult> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.subject = '✅ Solicitud Recibida - SomosTécnicos'
    sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Solicitud Recibida - SomosTécnicos</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                .header { background: #A50034; color: white; padding: 30px 20px; text-align: center; position: relative; overflow: hidden; }
                .header-circle { width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 30px; }
                .content { padding: 40px 30px; }
                .info-box { background: #f8f9fa; padding: 25px; margin: 25px 0; border-radius: 8px; border: 1px solid #e9ecef; }
                .steps { margin: 0; padding: 0; list-style: none; }
                .step-item { display: flex; margin-bottom: 15px; }
                .step-number { background: #A50034; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 15px; flex-shrink: 0; margin-top: 2px; }
                .contact-box { text-align: center; border-top: 1px solid #eee; margin-top: 30px; padding-top: 30px; color: #666; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; background: #f4f4f4; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="header-circle">�</div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Solicitud Recibida</h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Gracias por postularte a SomosTécnicos</p>
                </div>

                <div class="content">
                    <h2 style="margin-top: 0; color: #1a1a1a;">¡Hola ${applicantName}!</h2>
                    <p style="color: #4a4a4a; font-size: 16px;">Hemos recibido tus documentos y datos correctamente. Tu solicitud para unirte a nuestro equipo está en proceso.</p>

                    <div class="info-box">
                        <h3 style="margin-top: 0; color: #A50034; font-size: 18px; margin-bottom: 20px;">�️ Próximos Pasos</h3>
                        <div class="steps">
                            <div class="step-item">
                                <div class="step-number">1</div>
                                <div><strong>Revisión:</strong> Evaluaremos tu perfil en 24-48 horas.</div>
                            </div>
                            <div class="step-item">
                                <div class="step-number">2</div>
                                <div><strong>Validación:</strong> Verificaremos tus antecedentes y certificaciones.</div>
                            </div>
                            <div class="step-item">
                                <div class="step-number">3</div>
                                <div><strong>Respuesta:</strong> Te enviaremos un email con la decisión final.</div>
                            </div>
                        </div>
                    </div>

                    <div class="contact-box">
                        <p style="margin-bottom: 5px;"><strong>¿Tienes alguna pregunta?</strong></p>
                        <p style="margin: 5px 0;">Email: <a href="mailto:soporte@somostecnicos.com" style="color: #A50034; text-decoration: none;">soporte@somostecnicos.com</a></p>
                        <p style="margin: 5px 0;">Teléfono: <strong>(+57) 3003094854</strong></p>
                    </div>
                </div>

                <div class="footer">
                    <p>© 2026 SomosTécnicos - Red de Profesionales</p>
                    <p>Bogotá, Colombia</p>
                </div>
            </div>
        </body>
        </html>
      `
    sendSmtpEmail.sender = defaultSender
    sendSmtpEmail.to = [{ email: applicantEmail, name: applicantName }]

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)

    return {
      success: true,
      messageId: result.body.messageId
    }
  } catch (error: any) {
    console.error('Error enviando confirmación de solicitud:', error)
    return {
      success: false,
      error: error?.body?.message || error.message || 'Error desconocido'
    }
  }
}

/**
 * Envía email de aprobación de solicitud de técnico
 */
export async function sendTechnicianApprovedEmail(
  technicianEmail: string,
  technicianName: string,
  username: string,
  tempPassword: string
): Promise<NotificationResult> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.subject = '🎉 Solicitud Aprobada - Bienvenido a SomosTécnicos'
    sendSmtpEmail.sender = defaultSender
    sendSmtpEmail.to = [{ email: technicianEmail, name: technicianName }]
    sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Solicitud Aprobada - SomosTécnicos</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                .header { background: #A50034; color: white; padding: 30px 20px; text-align: center; }
                .header-icon { font-size: 40px; margin-bottom: 10px; }
                .content { padding: 40px 30px; }
                .credentials-card { background: #f3f4f6; padding: 25px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb; border-left: 4px solid #A50034; }
                .warning-card { background: #fffbeb; padding: 15px; margin: 20px 0; border-radius: 8px; border: 1px solid #fcd34d; color: #92400e; font-size: 14px; }
                .step-list { margin: 0; padding: 0; list-style: none; }
                .step-list li { margin-bottom: 10px; padding-left: 25px; position: relative; }
                .step-list li:before { content: "✓"; color: #A50034; position: absolute; left: 0; font-weight: bold; }
                .button { background: #A50034; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; font-weight: bold; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; background: #f4f4f4; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="header-icon">🎉</div>
                    <h1 style="margin: 0; font-size: 24px;">Confirmación de Aprobación</h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">¡Bienvenido al Equipo de SomosTécnicos!</p>
                </div>

                <div class="content">
                    <h2 style="margin-top: 0; color: #1a1a1a;">Hola ${technicianName},</h2>
                    <p>Nos complace informarte que tu solicitud para unirte a <strong>SomosTécnicos</strong> ha sido aprobada exitosamente.</p>

                    <p>A partir de ahora eres parte de nuestra red de profesionales de confianza.</p>

                    <div class="credentials-card">
                        <h3 style="margin-top: 0; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">🔑 Tus Credenciales de Acceso</h3>
                        <p style="margin: 10px 0 5px;"><strong>Usuario / Email:</strong></p>
                        <p style="background: white; padding: 8px; border-radius: 4px; border: 1px solid #ddd; margin: 0;">${username}</p>

                        <p style="margin: 15px 0 5px;"><strong>Contraseña Temporal:</strong></p>
                        <p style="background: white; padding: 8px; border-radius: 4px; border: 1px solid #ddd; margin: 0; font-family: monospace; font-size: 16px;">${tempPassword}</p>
                    </div>

                    <div class="warning-card">
                        <strong>⚠️ Importante:</strong> Por motivos de seguridad, el sistema te pedirá cambiar tu contraseña al iniciar sesión por primera vez.
                    </div>

                    <h3 style="color: #A50034;">🚀 Próximos Pasos</h3>
                    <ul class="step-list">
                        <li>Ingresa al panel de técnicos con tus credenciales.</li>
                        <li>Configura tu disponibilidad en el calendario.</li>
                        <li>Mantente atento a las notificaciones de nuevos servicios en tu zona.</li>
                    </ul>

                    <div style="text-align: center;">
                        <a href="${APP_URL}/login" class="button">
                            Iniciar Sesión en el Portal
                        </a>
                    </div>
                </div>

                <div class="footer">
                    <p>© 2026 SomosTécnicos - Red de Profesionales</p>
                    <p>Si tienes problemas para acceder, contacta a soporte@somostecnicos.com</p>
                </div>
            </div>
        </body>
        </html>
    `

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)

    return {
      success: true,
      messageId: result.body.messageId
    }
  } catch (error: any) {
    console.error('Error enviando email de aprobación:', error)
    return {
      success: false,
      error: error?.body?.message || error.message || 'Error desconocido'
    }
  }
}

/**
 * Envía notificación al administrador sobre nueva solicitud
 */
export async function sendNewTechnicianApplicationNotification(
  adminEmail: string,
  applicationData: {
    nombre: string
    apellido: string
    email: string
    telefono: string
    cedula: string
    ciudad: string
    especialidades: string[]
    zonaPreferida: string
    experienciaAnios?: number
  }
): Promise<NotificationResult> {
  try {
    const especialidadesText = applicationData.especialidades.join(', ')

    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.subject = '🆕 Nueva Solicitud de Técnico - Requiere Revisión'
    sendSmtpEmail.sender = defaultSender
    sendSmtpEmail.to = [{ email: adminEmail }]
    sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Nueva Solicitud de Técnico</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                .header { background: #111827; color: white; padding: 25px; text-align: center; }
                .content { padding: 30px; }
                .data-card { background: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin: 20px 0; }
                .data-row { display: flex; padding: 12px 15px; border-bottom: 1px solid #f0f0f0; }
                .data-row:last-child { border-bottom: none; }
                .data-label { width: 140px; font-weight: bold; color: #666; }
                .data-value { flex: 1; color: #333; }
                .section-title { color: #A50034; border-bottom: 2px solid #A50034; padding-bottom: 5px; margin-top: 25px; margin-bottom: 15px; font-size: 16px; }
                .button { background: #A50034; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; background: #f4f4f4; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 22px;">Nueva Solicitud Recibida</h1>
                    <p style="margin: 5px 0 0 0; color: #9ca3af; font-size: 14px;">Panel Administrativo SomosTécnicos</p>
                </div>

                <div class="content">
                    <p><strong>Atención Admin:</strong> Se ha registrado una nueva postulación para técnico.</p>

                    <h3 class="section-title">👤 Información del Solicitante</h3>
                    <div class="data-card">
                        <div class="data-row">
                            <span class="data-label">Nombre:</span>
                            <span class="data-value">${applicationData.nombre} ${applicationData.apellido}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Cédula:</span>
                            <span class="data-value">${applicationData.cedula}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Email:</span>
                            <span class="data-value"><a href="mailto:${applicationData.email}">${applicationData.email}</a></span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Teléfono:</span>
                            <span class="data-value">${applicationData.telefono}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Ciudad:</span>
                            <span class="data-value">${applicationData.ciudad}</span>
                        </div>
                    </div>

                    <h3 class="section-title">🛠️ Perfil Profesional</h3>
                    <div class="data-card">
                        <div class="data-row">
                            <span class="data-label">Especialidades:</span>
                            <span class="data-value">${especialidadesText}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Zona Preferida:</span>
                            <span class="data-value">${applicationData.zonaPreferida}</span>
                        </div>
                        ${applicationData.experienciaAnios ? `
                        <div class="data-row">
                            <span class="data-label">Experiencia:</span>
                            <span class="data-value">${applicationData.experienciaAnios} Años</span>
                        </div>
                        ` : ''}
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${APP_URL}/admin/applications" class="button">
                            Revisar en el Panel
                        </a>
                    </div>
                </div>

                <div class="footer">
                    <p>© 2026 Admin Panel - SomosTécnicos</p>
                </div>
            </div>
        </body>
        </html>
      `

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)

    return {
      success: true,
      messageId: result.body.messageId
    }
  } catch (error: any) {
    console.error('Error enviando notificación al admin:', error)
    return {
      success: false,
      error: error?.body?.message || error.message || 'Error desconocido'
    }
  }
}

/**
 * Envía email al técnico con los detalles de la asignación
 */
export async function sendTechnicianAssignmentEmail(data: {
  technicianName: string
  technicianEmail: string
  orderNumber: string
  customerName: string
  address: string
  appliance: string
  scheduledDate?: string | null
  notes?: string
}): Promise<NotificationResult> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.subject = `🔔 Nueva Asignación - Orden ${data.orderNumber}`
    sendSmtpEmail.sender = defaultSender
    sendSmtpEmail.to = [{ email: data.technicianEmail, name: data.technicianName }]

    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <style>
              body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; border-top: 5px solid #A50034; }
              .header { text-align: center; margin-bottom: 20px; }
              .details { background-color: #f9f9f9; padding: 15px; border-radius: 4px; border: 1px solid #eee; }
              .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
              .value { margin-bottom: 10px; font-size: 16px; }
              .button { display: inline-block; background-color: #A50034; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px; text-align: center; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>Nueva Orden Asignada</h2>
                  <p>Hola ${data.technicianName}, se te ha asignado un nuevo servicio.</p>
              </div>

              <div class="details">
                  <div class="label">Orden</div>
                  <div class="value">#${data.orderNumber}</div>

                  <div class="label">Cliente</div>
                  <div class="value">${data.customerName}</div>

                  <div class="label">Dirección</div>
                  <div class="value">${data.address}</div>

                  <div class="label">Equipo</div>
                  <div class="value">${data.appliance}</div>

                  <div class="label">Fecha Programada</div>
                  <div class="value">${data.scheduledDate ? new Date(data.scheduledDate).toLocaleString() : 'Por coordinar'}</div>

                  ${data.notes ? `
                  <div class="label">Notas Internas</div>
                  <div class="value">${data.notes}</div>
                  ` : ''}
              </div>

              <div style="text-align: center;">
                  <a href="${APP_URL}/technician/orders/${data.orderNumber}" class="button">Ver Detalles</a>
              </div>
          </div>
      </body>
      </html>
    `

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)
    return { success: true, messageId: result.body.messageId }
  } catch (error: any) {
    console.error('Error enviando email al técnico:', error)
    return { success: false, error: error?.message || 'Error desconocido' }
  }
}

/**
 * Envía email al cliente informando que un técnico ha sido asignado
 */
export async function sendCustomerAssignmentEmail(data: {
  customerName: string
  customerEmail: string
  orderNumber: string
  technicianName: string
  technicianPhone: string
  scheduledDate?: string | null
  appliance: string
}): Promise<NotificationResult> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.subject = `👨‍🔧 Técnico Asignado - Orden ${data.orderNumber}`
    sendSmtpEmail.sender = defaultSender
    sendSmtpEmail.to = [{ email: data.customerEmail, name: data.customerName }]

    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <style>
              body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; border-top: 5px solid #A50034; }
              .header { text-align: center; margin-bottom: 20px; }
              .technician-card { background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>¡Técnico en Camino!</h2>
                  <p>Hola ${data.customerName}, hemos asignado un profesional para revisar tu ${data.appliance}.</p>
              </div>

              <div class="technician-card">
                  <h3>Datos del Técnico</h3>
                  <p><strong>Nombre:</strong> ${data.technicianName}</p>
                  <p><strong>Teléfono:</strong> ${data.technicianPhone}</p>
                  <p><strong>Fecha Programada:</strong> ${data.scheduledDate ? new Date(data.scheduledDate).toLocaleString() : 'Por coordinar'}</p>
              </div>

              <p style="text-align: center; font-size: 14px; color: #666;">
                  Si tienes alguna duda, puedes contactar directamente al técnico o a nuestro soporte.
              </p>
          </div>
      </body>
      </html>
    `

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)
    return { success: true, messageId: result.body.messageId }
  } catch (error: any) {
    console.error('Error enviando email al cliente:', error)
    return { success: false, error: error?.message || 'Error desconocido' }
  }
}

/**
 * Valida configuración de email
 */
export function validateEmailConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!process.env.BREVO_API_KEY) {
    errors.push('BREVO_API_KEY no configurada')
  }

  // FROM_EMAIL y BREVO_SENDER_EMAIL se manejan con defaults en brevo-client.ts

  return {
    isValid: errors.length === 0,
    errors
  }
}
