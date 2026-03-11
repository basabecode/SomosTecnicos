/**
 * Password Reset Email Service
 * Servicio para enviar emails de recuperación de contraseña usando Brevo
 */

import { apiInstance, brevo, defaultSender, appUrl } from './brevo-client'
import {
  getPasswordResetEmailHTML,
  getPasswordResetEmailText
} from './templates/password-reset'

interface SendPasswordResetEmailParams {
  to: string
  userName: string
  resetToken: string
}

export async function sendPasswordResetEmail({
  to,
  userName,
  resetToken
}: SendPasswordResetEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    // Construir el enlace de recuperación
    const resetLink = `${appUrl}/reset-password?token=${resetToken}`
    const expiresInHours = 1
    const brandLogoUrl = `${appUrl}/img-3d/logo-email.avif`

    // Preparar el contenido del email
    const htmlContent = getPasswordResetEmailHTML({
      userName,
      resetLink,
      expiresInHours,
      brandLogoUrl
    })

    const textContent = getPasswordResetEmailText({
      userName,
      resetLink,
      expiresInHours
    })

    // Configurar el email
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.sender = defaultSender
    sendSmtpEmail.to = [{ email: to, name: userName }]
    sendSmtpEmail.subject = 'Recuperación de Contraseña - SomosTécnicos'
    sendSmtpEmail.htmlContent = htmlContent
    sendSmtpEmail.textContent = textContent

    // Enviar el email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)

    console.log('✅ Email de recuperación enviado:', {
      to,
      response: response.body || response
    })

    return { success: true }
  } catch (error) {
    console.error('❌ Error enviando email de recuperación:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al enviar email'
    }
  }
}


