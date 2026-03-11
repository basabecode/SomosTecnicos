/**
 * Sistema de Notificaciones por Email
 * Integración con Brevo para envío de emails automáticos
 */

import { apiInstance, brevo, defaultSender } from './email/brevo-client'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const BRAND_LOGO_URL = `${APP_URL}/img-3d/logo-email.avif`

function renderBrandedEmailTemplate(params: {
  title: string
  subtitle?: string
  content: string
  accentColor?: string
  footerText?: string
}): string {
  const {
    title,
    subtitle,
    content,
    accentColor = '#A50034',
    footerText = '© 2026 SomosTécnicos - Servicio Técnico Profesional'
  } = params

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - SomosTécnicos</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #334155; background-color: #F3F4F6; margin: 0; padding: 24px 0; }
        .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB; }
        .header { background: linear-gradient(135deg, ${accentColor} 0%, #1F2937 100%); color: #ffffff; text-align: center; padding: 28px 24px; }
        .header img { display: block; margin: 0 auto 14px auto; max-width: 220px; height: auto; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 8px 0 0 0; opacity: 0.95; font-size: 14px; }
        .content { padding: 30px 26px; font-size: 15px; }
        .card { background: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid ${accentColor}; border-radius: 8px; padding: 16px; margin: 18px 0; }
        .button { display: inline-block; background: ${accentColor}; color: #ffffff !important; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: 600; }
        .footer { text-align: center; padding: 18px; font-size: 12px; color: #6B7280; background: #F9FAFB; border-top: 1px solid #E5E7EB; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${BRAND_LOGO_URL}" alt="SomosTécnicos" />
          <h1>${title}</h1>
          ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
        <div class="content">${content}</div>
        <div class="footer">${footerText}</div>
      </div>
    </body>
    </html>
  `
}

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
  return renderBrandedEmailTemplate({
    title: 'Confirmacion de Servicio',
    subtitle: `Orden #${data.orderNumber}`,
    content: `
      <p>Hola <strong>${data.customerName}</strong>,</p>
      <p>Hemos recibido tu solicitud correctamente. Un tecnico especializado revisara tu caso en breve.</p>

      <div class="card">
        <p style="margin:0 0 8px 0;"><strong>Servicio:</strong> ${data.serviceType}</p>
        <p style="margin:0 0 8px 0;"><strong>Electrodomestico:</strong> ${data.applianceType}</p>
        <p style="margin:0 0 8px 0;"><strong>Fecha Preferida:</strong> ${data.preferredDate}</p>
        <p style="margin:0;"><strong>Direccion:</strong> ${data.address}</p>
      </div>

      <p style="text-align:center; margin-top: 22px;">
        <a href="${APP_URL}/seguimiento?order=${data.orderNumber}" class="button">Seguir mi Orden</a>
      </p>
      <p style="font-size: 13px; color:#6B7280; text-align:center; margin-top:20px;">
        Soporte: (+57) 3003094854 | soporte@somostecnicos.com
      </p>
    `
  })
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

  return renderBrandedEmailTemplate({
    title: 'Actualizacion de Estado',
    subtitle: `Orden #${data.orderNumber}`,
    content: `
      <p>Hola <strong>${data.customerName}</strong>,</p>
      <div class="card">
        <p style="margin: 0 0 8px 0;"><strong>${statusMessage}</strong></p>
        <p style="margin: 0;">El estado de tu orden cambio a <strong>${data.status}</strong>.</p>
        ${data.notes ? `<p style="margin: 10px 0 0 0; font-style: italic;">"${data.notes}"</p>` : ''}
      </div>

      ${data.technicianName ? `
      <div class="card">
        <p style="margin:0 0 8px 0;"><strong>Tecnico:</strong> ${data.technicianName}</p>
        <p style="margin:0 0 8px 0;"><strong>Telefono:</strong> ${data.technicianPhone || 'No disponible'}</p>
        ${data.estimatedCost ? `<p style="margin:0;"><strong>Costo Estimado:</strong> $${data.estimatedCost.toLocaleString()}</p>` : ''}
      </div>
      ` : ''}

      <p style="text-align:center; margin-top: 22px;">
        <a href="${APP_URL}/seguimiento?order=${data.orderNumber}" class="button">Ver Detalles</a>
      </p>
    `
  })
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
    sendSmtpEmail.htmlContent = renderBrandedEmailTemplate({
      title: subject,
      content: `<p>${message}</p>`
    })
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
    sendSmtpEmail.htmlContent = renderBrandedEmailTemplate({
      title: 'Solicitud Recibida',
      subtitle: 'Gracias por postularte a SomosTécnicos',
      content: `
        <p>Hola <strong>${applicantName}</strong>,</p>
        <p>Hemos recibido tus documentos y datos correctamente. Tu solicitud esta en proceso.</p>
        <div class="card">
          <p style="margin:0 0 8px 0;"><strong>Proximos pasos:</strong></p>
          <p style="margin:0 0 6px 0;">1. Revision de perfil (24-48 horas).</p>
          <p style="margin:0 0 6px 0;">2. Validacion de antecedentes y certificaciones.</p>
          <p style="margin:0;">3. Te enviaremos un correo con la decision final.</p>
        </div>
        <p style="font-size:13px; color:#6B7280;">
          Soporte: soporte@somostecnicos.com | (+57) 3003094854
        </p>
      `,
      footerText: '© 2026 SomosTécnicos - Red de Profesionales'
    })
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
    sendSmtpEmail.htmlContent = renderBrandedEmailTemplate({
      title: 'Solicitud Aprobada',
      subtitle: 'Bienvenido al equipo de SomosTécnicos',
      content: `
        <p>Hola <strong>${technicianName}</strong>, tu solicitud fue aprobada exitosamente.</p>
        <div class="card">
          <p style="margin:0 0 8px 0;"><strong>Usuario / Email:</strong> ${username}</p>
          <p style="margin:0;"><strong>Contrasena temporal:</strong> ${tempPassword}</p>
        </div>
        <div class="card" style="border-left-color:#D97706; background:#FFFBEB;">
          <p style="margin:0;"><strong>Importante:</strong> debes cambiar esta contrasena al primer inicio de sesion.</p>
        </div>
        <p style="text-align:center; margin-top:22px;">
          <a href="${APP_URL}/login" class="button">Iniciar Sesion</a>
        </p>
      `,
      footerText: '© 2026 SomosTécnicos - Red de Profesionales'
    })

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
    sendSmtpEmail.htmlContent = renderBrandedEmailTemplate({
      title: 'Nueva Solicitud de Tecnico',
      subtitle: 'Panel administrativo',
      content: `
        <p>Se registro una nueva postulacion para tecnico.</p>
        <div class="card">
          <p style="margin:0 0 6px 0;"><strong>Nombre:</strong> ${applicationData.nombre} ${applicationData.apellido}</p>
          <p style="margin:0 0 6px 0;"><strong>Cedula:</strong> ${applicationData.cedula}</p>
          <p style="margin:0 0 6px 0;"><strong>Email:</strong> ${applicationData.email}</p>
          <p style="margin:0 0 6px 0;"><strong>Telefono:</strong> ${applicationData.telefono}</p>
          <p style="margin:0 0 6px 0;"><strong>Ciudad:</strong> ${applicationData.ciudad}</p>
          <p style="margin:0 0 6px 0;"><strong>Especialidades:</strong> ${especialidadesText}</p>
          <p style="margin:0;"><strong>Zona Preferida:</strong> ${applicationData.zonaPreferida}</p>
          ${applicationData.experienciaAnios ? `<p style="margin:6px 0 0 0;"><strong>Experiencia:</strong> ${applicationData.experienciaAnios} anios</p>` : ''}
        </div>
        <p style="text-align:center; margin-top:22px;">
          <a href="${APP_URL}/admin/applications" class="button">Revisar en el Panel</a>
        </p>
      `,
      accentColor: '#111827',
      footerText: '© 2026 Admin Panel - SomosTécnicos'
    })

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

    sendSmtpEmail.htmlContent = renderBrandedEmailTemplate({
      title: 'Nueva Orden Asignada',
      subtitle: `Orden #${data.orderNumber}`,
      content: `
        <p>Hola <strong>${data.technicianName}</strong>, se te asigno un nuevo servicio.</p>
        <div class="card">
          <p style="margin:0 0 8px 0;"><strong>Cliente:</strong> ${data.customerName}</p>
          <p style="margin:0 0 8px 0;"><strong>Direccion:</strong> ${data.address}</p>
          <p style="margin:0 0 8px 0;"><strong>Equipo:</strong> ${data.appliance}</p>
          <p style="margin:0;"><strong>Fecha Programada:</strong> ${data.scheduledDate ? new Date(data.scheduledDate).toLocaleString() : 'Por coordinar'}</p>
          ${data.notes ? `<p style="margin:8px 0 0 0;"><strong>Notas:</strong> ${data.notes}</p>` : ''}
        </div>
        <p style="text-align:center; margin-top:22px;">
          <a href="${APP_URL}/technician/orders/${data.orderNumber}" class="button">Ver Detalles</a>
        </p>
      `
    })

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

    sendSmtpEmail.htmlContent = renderBrandedEmailTemplate({
      title: 'Tecnico Asignado',
      subtitle: `Orden #${data.orderNumber}`,
      content: `
        <p>Hola <strong>${data.customerName}</strong>, ya asignamos un profesional para revisar tu ${data.appliance}.</p>
        <div class="card">
          <p style="margin:0 0 8px 0;"><strong>Tecnico:</strong> ${data.technicianName}</p>
          <p style="margin:0 0 8px 0;"><strong>Telefono:</strong> ${data.technicianPhone}</p>
          <p style="margin:0;"><strong>Fecha Programada:</strong> ${data.scheduledDate ? new Date(data.scheduledDate).toLocaleString() : 'Por coordinar'}</p>
        </div>
        <p style="font-size:13px; color:#6B7280; text-align:center;">
          Si tienes dudas, contacta directamente al tecnico o a nuestro soporte.
        </p>
      `
    })

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


