/**
 * Password Changed Confirmation Email Template
 * Plantilla para notificar al usuario que su contraseña fue cambiada
 */

interface PasswordChangedEmailParams {
  userName: string
  changeDate: string
  changeTime: string
  ipAddress?: string
  userAgent?: string
}

export function getPasswordChangedEmailHTML({
  userName,
  changeDate,
  changeTime,
  ipAddress,
  userAgent
}: PasswordChangedEmailParams): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contraseña Actualizada - SomosTécnicos</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f7fa; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #16A34A 0%, #15803D 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                SomosTécnicos
              </h1>
              <p style="margin: 10px 0 0 0; color: #E8F4FD; font-size: 14px; font-weight: 500;">
                Servicio Técnico Profesional
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 80px; height: 80px; background-color: #DCFCE7; border-radius: 50%; padding: 20px;">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>

              <h2 style="margin: 0 0 20px 0; color: #2C3E50; font-size: 24px; font-weight: 600; text-align: center;">
                Contraseña Actualizada
              </h2>

              <p style="margin: 0 0 20px 0; color: #4A5568; font-size: 16px; line-height: 1.6;">
                Hola <strong>${userName}</strong>,
              </p>

              <p style="margin: 0 0 30px 0; color: #4A5568; font-size: 16px; line-height: 1.6;">
                Te confirmamos que la contraseña de tu cuenta en SomosTécnicos ha sido actualizada exitosamente.
              </p>

              <!-- Info Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F0FDF4; border-left: 4px solid #16A34A; border-radius: 6px; margin: 0 0 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 15px 0; color: #2C3E50; font-size: 14px; font-weight: 600;">
                      📋 Detalles del Cambio
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 5px 0; color: #6B7280; font-size: 14px; width: 120px;">Fecha:</td>
                        <td style="padding: 5px 0; color: #2C3E50; font-size: 14px; font-weight: 500;">${changeDate}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #6B7280; font-size: 14px;">Hora:</td>
                        <td style="padding: 5px 0; color: #2C3E50; font-size: 14px; font-weight: 500;">${changeTime}</td>
                      </tr>
                      ${ipAddress ? `
                      <tr>
                        <td style="padding: 5px 0; color: #6B7280; font-size: 14px;">Dirección IP:</td>
                        <td style="padding: 5px 0; color: #2C3E50; font-size: 14px; font-weight: 500;">${ipAddress}</td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security Warning -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FEF2F2; border-left: 4px solid #DC2626; border-radius: 6px; margin: 0 0 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 10px 0; color: #DC2626; font-size: 14px; font-weight: 600;">
                      ⚠️ ¿No fuiste tú?
                    </p>
                    <p style="margin: 0 0 15px 0; color: #4A5568; font-size: 14px; line-height: 1.5;">
                      Si no realizaste este cambio, tu cuenta podría estar comprometida. Por favor, contacta inmediatamente a nuestro equipo de soporte.
                    </p>
                    <a href="mailto:soporte@somostecnicos.com" style="display: inline-block; background-color: #DC2626; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600;">
                      Reportar Actividad Sospechosa
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Tips -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F7FAFC; border-radius: 6px; padding: 20px; margin: 30px 0 0 0;">
                <tr>
                  <td>
                    <p style="margin: 0 0 10px 0; color: #2C3E50; font-size: 14px; font-weight: 600;">
                      🔒 Consejos de Seguridad
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #4A5568; font-size: 13px; line-height: 1.6;">
                      <li style="margin-bottom: 8px;">Usa contraseñas únicas para cada servicio</li>
                      <li style="margin-bottom: 8px;">Cambia tu contraseña regularmente</li>
                      <li style="margin-bottom: 8px;">Nunca compartas tu contraseña con nadie</li>
                      <li>Habilita la autenticación de dos factores cuando esté disponible</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F7FAFC; padding: 30px; text-align: center; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                ¿Necesitas ayuda? Contáctanos
              </p>
              <p style="margin: 0 0 20px 0;">
                <a href="mailto:soporte@somostecnicos.com" style="color: #16A34A; text-decoration: none; font-weight: 600; font-size: 14px;">
                  soporte@somostecnicos.com
                </a>
              </p>
              <p style="margin: 0; color: #A0AEC0; font-size: 12px;">
                © 2026 SomosTécnicos. Todos los derechos reservados.
              </p>
              <p style="margin: 10px 0 0 0; color: #A0AEC0; font-size: 12px;">
                Servicio Técnico Profesional | Calidad Certificada
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export function getPasswordChangedEmailText({
  userName,
  changeDate,
  changeTime,
  ipAddress
}: PasswordChangedEmailParams): string {
  return `
Hola ${userName},

Te confirmamos que la contraseña de tu cuenta en SomosTécnicos ha sido actualizada exitosamente.

DETALLES DEL CAMBIO:
- Fecha: ${changeDate}
- Hora: ${changeTime}
${ipAddress ? `- Dirección IP: ${ipAddress}` : ''}

⚠️ ¿NO FUISTE TÚ?
Si no realizaste este cambio, tu cuenta podría estar comprometida. Por favor, contacta inmediatamente a nuestro equipo de soporte en soporte@somostecnicos.com

CONSEJOS DE SEGURIDAD:
- Usa contraseñas únicas para cada servicio
- Cambia tu contraseña regularmente
- Nunca compartas tu contraseña con nadie
- Habilita la autenticación de dos factores cuando esté disponible

¿Necesitas ayuda? Contáctanos en soporte@somostecnicos.com

© 2026 SomosTécnicos - Servicio Técnico Profesional
  `.trim()
}
