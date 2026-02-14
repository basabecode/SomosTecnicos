import 'dotenv/config'
import { apiInstance, defaultSender, appUrl } from '../lib/email/brevo-client'
import * as brevo from '@getbrevo/brevo'


async function sendTestEmail(toEmail: string) {
  console.log('🚀 Iniciando prueba de envío de email...')
  console.log(`Environment Info:`)
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`- App URL: ${appUrl}`)
  console.log(`- Sender: ${defaultSender.name} <${defaultSender.email}>`)
  console.log(`- API Key Present: ${!!process.env.BREVO_API_KEY ? 'Yes' : 'No'}`)

  if (!process.env.BREVO_API_KEY) {
    console.error('❌ Error: BREVO_API_KEY is missing in environment variables.')
    process.exit(1)
  }

  const sendSmtpEmail = new brevo.SendSmtpEmail()
  sendSmtpEmail.sender = defaultSender
  sendSmtpEmail.to = [{ email: toEmail }]
  sendSmtpEmail.subject = 'Test Email from Vercel Config - SomosTécnicos'

  const htmlContent = `
    <html>
      <body>
        <h1>Test Email Success ✅</h1>
        <p>This is a test email sent to verify Brevo integration.</p>
        <p><strong>App URL configured:</strong> ${appUrl}</p>
        <p>If you see this, your email configuration is working correctly.</p>
        <p><a href="${appUrl}">Visit App</a></p>
      </body>
    </html>
  `
  sendSmtpEmail.htmlContent = htmlContent

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('✅ Email sent successfully!')
    console.log('Response:', JSON.stringify(data, null, 2))
  } catch (error: any) {
    console.error('❌ Failed to send email:', error)
    if (error.response) {
      console.error('API Response Error:', error.response.body)
    }
  }
}

// Simple CLI args parsing
const args = process.argv.slice(2)
const toEmailArg = args.find(arg => arg.startsWith('--to='))?.split('=')[1]
const isDryRun = args.includes('--dry-run')

if (toEmailArg) {
  if (isDryRun) {
     console.log('Running in DRY-RUN mode. No email will be sent.')
     // We already logged the config above, so just exit
     process.exit(0)
  }
  sendTestEmail(toEmailArg)
} else if (isDryRun) {
  // Just show config
  console.log('Running in DRY-RUN mode. Configuration verified.')
  console.log(`Environment Info:`)
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`- App URL: ${appUrl}`)
  console.log(`- Sender: ${defaultSender.name} <${defaultSender.email}>`)
  console.log(`- API Key Present: ${!!process.env.BREVO_API_KEY ? 'Yes' : 'No'}`)
  if (!process.env.BREVO_API_KEY) {
      console.error('❌ Error: BREVO_API_KEY is missing.')
      process.exit(1)
  }
  console.log('✅ Configuration looks good (Dry Run).')
} else {
  console.log('Usage: npx tsx scripts/test-email.ts --to=your-email@example.com [--dry-run]')
}
