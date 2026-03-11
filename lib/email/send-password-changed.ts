/**
 * Password Changed Confirmation Email Service
 * Servicio para enviar emails de confirmación de cambio de contraseña
 */

import { apiInstance, brevo, defaultSender, appUrl } from './brevo-client'
import {
  getPasswordChangedEmailHTML,
  getPasswordChangedEmailText
} from './templates/password-changed'

interface SendPasswordChangedEmailParams {
  to: string
  userName: string
  ipAddress?: string
  userAgent?: string
}

export async function sendPasswordChangedEmail({
  to,
  userName,
  ipAddress,
  userAgent
}: SendPasswordChangedEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    // Obtener fecha y hora actual
    const now = new Date()
    const changeDate = now.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const changeTime = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    const brandLogoUrl = `${appUrl}/img-3d/logo-email.avif`

    // Preparar el contenido del email
    const htmlContent = getPasswordChangedEmailHTML({
      userName,
      changeDate,
      changeTime,
      ipAddress,
      userAgent,
      brandLogoUrl
    })

    const textContent = getPasswordChangedEmailText({
      userName,
      changeDate,
      changeTime,
      ipAddress,
      userAgent
    })

    // Configurar el email
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.sender = defaultSender
    sendSmtpEmail.to = [{ email: to, name: userName }]
    sendSmtpEmail.subject = '✅ Contraseña Actualizada - SomosTécnicos'
    sendSmtpEmail.htmlContent = htmlContent
    sendSmtpEmail.textContent = textContent

    // Enviar el email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)

    console.log('✅ Email de confirmación de cambio enviado:', {
      to,
      response: response.body || response
    })

    return { success: true }
  } catch (error) {
    console.error('❌ Error enviando email de confirmación:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al enviar email'
    }
  }
}


