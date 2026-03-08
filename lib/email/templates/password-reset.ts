/**
 * Password Reset Email Template
 * Plantilla HTML profesional para emails de recuperación de contraseña
 */

interface PasswordResetEmailParams {
  userName: string
  resetLink: string
  expiresInHours: number
  brandLogoUrl?: string
}

export function getPasswordResetEmailHTML({
  userName,
  resetLink,
  expiresInHours,
  brandLogoUrl
}: PasswordResetEmailParams): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperación de Contraseña - SomosTécnicos</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f7fa; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #A50034 0%, #8B1538 50%, #2C3E50 100%); padding: 40px 30px; text-align: center;">
              ${brandLogoUrl ? `
              <img
                src="${brandLogoUrl}"
                alt="SomosTécnicos"
                width="220"
                style="display: block; margin: 0 auto 18px auto; max-width: 220px; height: auto;"
              />
              ` : ''}
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
              <h2 style="margin: 0 0 20px 0; color: #2C3E50; font-size: 24px; font-weight: 600;">
                Recuperación de Contraseña
              </h2>

              <p style="margin: 0 0 20px 0; color: #4A5568; font-size: 16px; line-height: 1.6;">
                Hola <strong>${userName}</strong>,
              </p>

              <p style="margin: 0 0 20px 0; color: #4A5568; font-size: 16px; line-height: 1.6;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta en SomosTécnicos.
              </p>

              <p style="margin: 0 0 30px 0; color: #4A5568; font-size: 16px; line-height: 1.6;">
                Haz clic en el botón de abajo para crear una nueva contraseña:
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 0 0 30px 0;">
                    <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #A50034 0%, #E74C3C 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(165, 0, 52, 0.3); transition: all 0.3s ease;">
                      Restablecer Contraseña
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Info Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FFF5F5; border-left: 4px solid #A50034; border-radius: 6px; margin: 0 0 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 10px 0; color: #2C3E50; font-size: 14px; font-weight: 600;">
                      ⏰ Información Importante
                    </p>
                    <p style="margin: 0; color: #4A5568; font-size: 14px; line-height: 1.5;">
                      Este enlace expirará en <strong>${expiresInHours} hora${expiresInHours > 1 ? 's' : ''}</strong>. Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Alternative Link -->
              <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px; line-height: 1.6;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:
              </p>
              <p style="margin: 0 0 30px 0; word-break: break-all;">
                <a href="${resetLink}" style="color: #A50034; text-decoration: underline; font-size: 13px;">
                  ${resetLink}
                </a>
              </p>

              <!-- Security Notice -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F7FAFC; border-radius: 6px; padding: 20px; margin: 30px 0 0 0;">
                <tr>
                  <td>
                    <p style="margin: 0 0 10px 0; color: #2C3E50; font-size: 14px; font-weight: 600;">
                      🔒 Seguridad de tu Cuenta
                    </p>
                    <p style="margin: 0; color: #4A5568; font-size: 13px; line-height: 1.5;">
                      Nunca compartas tu contraseña con nadie. SomosTécnicos nunca te pedirá tu contraseña por correo electrónico o teléfono.
                    </p>
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
                <a href="mailto:soporte@somostecnicos.com" style="color: #A50034; text-decoration: none; font-weight: 600; font-size: 14px;">
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

export function getPasswordResetEmailText({
  userName,
  resetLink,
  expiresInHours
}: PasswordResetEmailParams): string {
  return `
Hola ${userName},

Recibimos una solicitud para restablecer la contraseña de tu cuenta en SomosTécnicos.

Para crear una nueva contraseña, visita el siguiente enlace:
${resetLink}

Este enlace expirará en ${expiresInHours} hora${expiresInHours > 1 ? 's' : ''}.

Si no solicitaste este cambio, puedes ignorar este correo de forma segura.

SEGURIDAD:
Nunca compartas tu contraseña con nadie. SomosTécnicos nunca te pedirá tu contraseña por correo electrónico o teléfono.

¿Necesitas ayuda? Contáctanos en soporte@somostecnicos.com

© 2026 SomosTécnicos - Servicio Técnico Profesional
  `.trim()
}
