
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const API_URL = 'http://localhost:3000/api' // Asumiendo local

// Colores para consola
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

function log(type: 'INFO' | 'SUCCESS' | 'ERROR' | 'WARN', message: string, data?: any) {
  const color = {
    INFO: colors.blue,
    SUCCESS: colors.green,
    ERROR: colors.red,
    WARN: colors.yellow
  }[type]
  console.log(`${color}[${type}] ${message}${colors.reset}`)
  if (data) console.log(JSON.stringify(data, null, 2))
}

async function setupTestUsers() {
  log('INFO', 'Configurando usuarios de prueba...')
  const passwordHash = await bcrypt.hash(process.env.DEMO_ADMIN_PASSWORD || 'ChangeMe2026!', 10)

  // 1. Crear Admin
  const adminEmail = 'admin.chat.test@somostecnicos.com'
  let admin = await prisma.adminUser.findUnique({ where: { email: adminEmail } })
  if (!admin) {
    admin = await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash: passwordHash,
        username: 'admin_chat_test',
        nombre: 'Admin Test',
        apellido: 'Chat',
        role: 'admin',
        activo: true
      }
    })
    log('SUCCESS', 'Admin creado')
  } else {
    log('INFO', 'Admin ya existe')
  }

  // 2. Crear Cliente
  const clientEmail = 'client.chat.test@somostecnicos.com'
  let client = await prisma.customer.findUnique({ where: { email: clientEmail } })
  if (!client) {
    client = await prisma.customer.create({
      data: {
        email: clientEmail,
        passwordHash: passwordHash,
        username: 'client_chat_test', // Campo requerido en schema
        nombre: 'Cliente Test Chat', // Usar nombre exacto para validación luego
        apellido: 'Chat',
        telefono: '5551234567',
        direccion: 'Calle Test 123'
      }
    })
    log('SUCCESS', 'Cliente creado')
  } else {
    log('INFO', 'Cliente ya existe')
  }

  // 3. Crear Técnico (Requiere AdminUser para login + Technician para datos)
  const techEmail = 'tech.chat.test@somostecnicos.com'

  // 3a. AdminUser para login
  let techUser = await prisma.adminUser.findUnique({ where: { email: techEmail } })
  if (!techUser) {
    techUser = await prisma.adminUser.create({
        data: {
            email: techEmail,
            passwordHash: passwordHash,
            username: 'tech_chat_test',
            nombre: 'Tecnico Test',
            role: 'technician',
            activo: true
        }
    })
  }

  // 3b. Perfil Técnico
  let tech = await prisma.technician.findUnique({ where: { email: techEmail } })
  if (!tech) {
    tech = await prisma.technician.create({
      data: {
        email: techEmail,
        nombre: 'Tecnico Test',
        telefono: '5559876543',
        cedula: 'TEST-CEDULA-123',
        especialidades: ['general'],
        zonaTrabajoArea: 'Norte',
        activo: true,
        disponible: true
      }
    })
    log('SUCCESS', 'Técnico creado (Perfil + Usuario)')
  } else {
    log('INFO', 'Técnico ya existe')
  }

  // Para el test, devolvemos el usuario AdminUser del técnico porque ese tiene el ID para login
  // Pero ojo: el sistema de mensajería puede usar el ID de Technician o el ID de AdminUser.
  // En authenticateRequest devuelve user.id. Si loguea por AdminUser, es el ID de AdminUser.

  return { admin, client, tech: techUser }

}

async function login(email: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: process.env.DEMO_ADMIN_PASSWORD || 'ChangeMe2026!' })
  })
  const data = await res.json()
  if (!data.success) {
    log('ERROR', `Fallo login para ${email}`, data)
    throw new Error('Login failed')
  }
  return data.accessToken
}

async function runTests() {
  try {
    const users = await setupTestUsers()

    // --- LOGIN ---
    log('INFO', 'Iniciando sesión...')
    const tokenClient = await login(users.client.email)
    const tokenAdmin = await login(users.admin.email)
    const tokenTech = await login(users.tech.email)
    log('SUCCESS', 'Tokens obtenidos para los 3 roles')

    // --- ESCENARIO 1: Cliente -> Soporte ---
    log('INFO', '--- TEST 1: Cliente envía mensaje a Soporte ---')
    const msgContent1 = `Mensaje de prueba cliente ${Date.now()}`

    const res1 = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenClient}`
      },
      body: JSON.stringify({
        content: msgContent1,
        receiverType: 'support', // Enviar a buzón general
        subject: 'Test Chat System'
      })
    })

    const data1 = await res1.json()
    if (!res1.ok) throw new Error(`Fallo envío mensaje cliente: ${JSON.stringify(data1)}`)

    log('SUCCESS', 'Mensaje enviado por Cliente', { id: data1.message.id, senderName: data1.message.senderName })

    // VALIDACIÓN CRÍTICA 1: Nombre del remitente
    if (data1.message.senderName !== 'Cliente Test Chat Chat') {
      log('ERROR', `CRÍTICO: El nombre del remitente se guardó mal. Esperado: "Cliente Test Chat Chat", Recibido: "${data1.message.senderName}"`)
    } else {
      log('SUCCESS', 'Chequeo de Nombre: CORRECTO')
    }

    // --- ESCENARIO 2: Admin Lee Mensaje ---
    log('INFO', '--- TEST 2: Admin lee mensaje ---')
    // Esperar un poco para simular latencia/polling
    await new Promise(r => setTimeout(r, 1000))

    const res2 = await fetch(`${API_URL}/messages?limit=10`, {
      headers: { 'Authorization': `Bearer ${tokenAdmin}` }
    })
    const data2 = await res2.json()

    const foundMsg = data2.messages.find((m: any) => m.id === data1.message.id)
    if (!foundMsg) {
      log('ERROR', 'El admin NO ve el mensaje del cliente')
    } else {
      log('SUCCESS', 'El admin VE el mensaje del cliente')
      // Validar datos enriquecidos
      if (foundMsg.from.name === 'Cliente Test Chat') {
        log('SUCCESS', 'El admin ve el NOMBRE CORRECTO cliente (Enrichment/Data OK)')
      } else {
        log('ERROR', `El admin ve nombre incorrecto: "${foundMsg.from.name}"`)
      }
    }

    // --- ESCENARIO 3: Admin Responde ---
    log('INFO', '--- TEST 3: Admin responde ---')
    // El admin responde al mensaje encontrado
    const replyContent = `Respuesta Admin ${Date.now()}`

    // Simular lógica de frontend: determinar receiverId
    // Si soy admin y recibí de cliente, receiverId = senderId del mensaje original
    const receiverId = foundMsg.senderId
    const receiverType = foundMsg.senderType

    const res3 = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenAdmin}`
        },
        body: JSON.stringify({
          content: replyContent,
          receiverId: receiverId,
          receiverType: receiverType,
          orderId: foundMsg.orderId,
          subject: `Re: ${foundMsg.subject}`
        })
      })

    const data3 = await res3.json()
    if (!res3.ok) throw new Error(`Fallo respuesta admin: ${JSON.stringify(data3)}`)

    log('SUCCESS', 'Respuesta enviada por Admin', {
        id: data3.message.id,
        receiverId: data3.message.receiverId,
        receiverType: data3.message.receiverType
    })

    // VALIDACIÓN CRÍTICA 2: Receiver ID
    if (String(data3.message.receiverId) !== String(users.client.id)) {
        log('ERROR', `CRÍTICO: El receiverId de la respuesta está MAL. Esperado: ${users.client.id}, Recibido: ${data3.message.receiverId}`)
    } else {
        log('SUCCESS', 'Chequeo ReceiverId: CORRECTO')
    }

    // --- ESCENARIO 4: Cliente Recibe ---
    log('INFO', '--- TEST 4: Cliente recibe respuesta ---')
    await new Promise(r => setTimeout(r, 1000))

    const res4 = await fetch(`${API_URL}/messages?limit=10`, {
        headers: { 'Authorization': `Bearer ${tokenClient}` }
    })
    const data4 = await res4.json()
    const foundReply = data4.messages.find((m: any) => m.id === data3.message.id)

    if (!foundReply) {
        log('ERROR', 'El cliente NO ve la respuesta del admin')
    } else {
        log('SUCCESS', 'El cliente VE la respuesta del admin')
        // Validar alineación visual (lógica isMe)
        // isMe = (msg.senderId == client.id)
        // Para este mensaje, sender es Admin. isMe debe ser false.
        const isMe = String(foundReply.senderId) === String(users.client.id)
        if (!isMe) {
            log('SUCCESS', 'Lógica isMe correcta (es false para mensaje recibido)')
        } else {
            log('ERROR', 'Lógica isMe FALLA: El cliente cree que él envió el mensaje del admin')
        }
    }

    // --- CLEANUP (Opcional, borrar msgs creados) ---
    log('INFO', '--- TEST 5: Borrado de conversación (Cliente) ---')

    // Borrar la conversación completa (Thread: direct-support)
    const resDelete = await fetch(`${API_URL}/messages/thread/direct-support`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${tokenClient}` }
    })
    const dataDelete = await resDelete.json()

    if (resDelete.ok) {
        log('SUCCESS', 'Conversación borrada (Cleanup OK)', dataDelete)
    } else {
        log('ERROR', 'Fallo borrado de conversación', dataDelete)
    }

    log('SUCCESS', '--- TEST SUITE COMPLETADO ---')

  } catch (error) {
    log('ERROR', 'Test falló inesperadamente', error)
  } finally {
    await prisma.$disconnect()
  }
}

runTests()
