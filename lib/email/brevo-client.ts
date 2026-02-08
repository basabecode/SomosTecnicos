/**
 * Brevo Email Client Configuration
 * Configuración del cliente de Brevo para envío de emails transaccionales
 */

import * as brevo from '@getbrevo/brevo'

// Configurar la instancia de la API
const apiInstance = new brevo.TransactionalEmailsApi()

// Configurar la API key desde las variables de entorno
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
)

export { apiInstance, brevo }

// Configuración de remitente por defecto
export const defaultSender = {
  email: process.env.BREVO_SENDER_EMAIL || 'noreply@somostecnicos.com',
  name: process.env.BREVO_SENDER_NAME || 'SomosTécnicos'
}

// URL base de la aplicación
export const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
