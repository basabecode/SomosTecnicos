/**
 * Audit Test Script
 * Valida las mejoras de seguridad y lógica implementadas.
 *
 * Uso: pnpm tsx scripts/audit_test.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const API_URL = 'http://localhost:3000/api'

// Colores para consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
}

function log(msg: string, color: 'green' | 'red' | 'yellow' = 'green') {
  console.log(`${colors[color]}${msg}${colors.reset}`)
}

async function main() {
  try {
    log('🚀 Iniciando Auditoría del Sistema...\n')

    // 1. Preparar Datos (Crear un Admin, un Técnico y un Cliente para pruebas)
    log('1. Preparando datos de prueba...', 'yellow')

    // Admin
    const passwordHash = await bcrypt.hash('password123', 10)

    await prisma.adminUser.upsert({
      where: { email: 'admin@audit.com' },
      update: { passwordHash },
      create: {
        username: 'admin_audit',
        email: 'admin@audit.com',
        nombre: 'Admin Audit',
        passwordHash,
        role: 'admin'
      }
    })

    // Intentar Login Admin Audit
    log('   Intentando login Admin Audit...', 'yellow')
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@audit.com', password: 'password123' })
    })

    let adminToken = ''
    if (loginRes.ok) {
        const body = await loginRes.json()
        adminToken = body.accessToken
        log('   ✅ Login Admin exitoso')
    } else {
        log('   ❌ Falló login admin.', 'red')
        console.log(await loginRes.text())
        return
    }

    // 2. Probar Creación de Orden (Admin)
    log('\n2. Probando Creación de Orden...', 'yellow')
    const orderRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        nombre: 'Test Audit Client',
        telefono: '3001234567',
        email: 'client@audit.com',
        direccion: 'Calle Falsa 123',
        ciudad: 'Bogotá',
        tipoElectrodomestico: 'nevera',
        tipoServicio: 'reparacion',
        descripcionProblema: 'No enfría',
        urgencia: 'alta'
      })
    })

    let orderId = ''
    if (orderRes.ok) {
        const body = await orderRes.json()
        orderId = body.data.id
        log(`   ✅ Orden creada: ${body.data.orderNumber}`)
    } else {
        const err = await orderRes.text()
        log(`   ❌ Falló creación orden: ${err}`, 'red')
        return
    }

    // 3. Probar State Machine (Transición Inválida)
    log('\n3. Probando State Machine (Transición Inválida: Pendiente -> Entregado)...', 'yellow')
    const invalidStateRes = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ estado: 'entregado' })
    })

    if (invalidStateRes.status === 400) {
        log('   ✅ Sistema bloqueó transición inválida correctamente.')
    } else {
        log(`   ❌ Sistema PERMITIÓ transición inválida o falló con otro error: ${await invalidStateRes.text()}`, 'red')
    }

    // 4. Probar State Machine (Transición Válida)
    log('\n4. Probando State Machine (Transición Válida: Pendiente -> Cancelado)...', 'yellow')
    const validStateRes = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ estado: 'cancelado' })
    })

    if (validStateRes.ok) {
        log('   ✅ Transición válida permitida.')
    } else {
        log(`   ❌ Transición válida falló: ${await validStateRes.text()}`, 'red')
    }

    // 5. Probar Booking Conflict (Solapamiento)
    log('\n5. Probando Booking Conflict...', 'yellow')

    // Necesitamos un técnico. Buscamos uno existente.
    const tech = await prisma.technician.findFirst()
    if (!tech) {
        log('   ❌ No hay técnicos en DB para probar.', 'red')
    } else {
        log(`   Usando técnico: ${tech.nombre} (ID: ${tech.id})`)

        // Asignación 1: Mañana 10:00 AM - 11:00 AM
        // Necesitamos orden activa para asignar
        const order2 = await prisma.order.create({
            data: {
                orderNumber: `AUDIT-BOOK-${Date.now()}`,
                nombre: 'Audit Booking',
                telefono: '123',
                email: 'book@audit.com',
                direccion: 'x',
                ciudad: 'x',
                tipoElectrodomestico: 'nevera',
                tipoServicio: 'reparacion',
                urgencia: 'media',
                estado: 'pendiente'
            }
        })

        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(10, 0, 0, 0)

        const assign1Res = await fetch(`${API_URL}/assignments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                orderId: order2.id,
                technicianId: tech.id,
                fechaProgramada: tomorrow.toISOString(),
                tiempoEstimado: 60 // 1 hora
            })
        })

        if (assign1Res.ok) {
            log('   ✅ Asignación 1 creada (Mañana 10:00).')

            // Asignación 2: Mañana 10:30 AM (Solapamiento)
            log('   Intentando crear asignación solapada (Mañana 10:30)...')

            const order3 = await prisma.order.create({
                data: {
                    orderNumber: `AUDIT-BOOK-2-${Date.now()}`,
                    nombre: 'Audit Booking 2',
                    telefono: '123',
                    email: 'book2@audit.com',
                    direccion: 'x',
                    ciudad: 'x',
                    tipoElectrodomestico: 'nevera',
                    tipoServicio: 'reparacion',
                    urgencia: 'media',
                    estado: 'pendiente'
                }
            })

            const tomorrowOverlap = new Date(tomorrow)
            tomorrowOverlap.setMinutes(30) // 10:30

             const assign2Res = await fetch(`${API_URL}/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({
                    orderId: order3.id,
                    technicianId: tech.id,
                    fechaProgramada: tomorrowOverlap.toISOString(),
                    tiempoEstimado: 60
                })
            })

            if (assign2Res.status === 409) {
                log('   ✅ Sistema bloqueó solapamiento correctamente.')
            } else {
                log(`   ❌ Sistema PERMITIÓ solapamiento o falló con otro error: ${await assign2Res.text()}`, 'red')
            }

        } else {
            console.log(await assign1Res.text())
            log(`   ❌ Falló creación asignación 1`, 'red')
        }
    }

    // 6. Resumen Final
    log('\n---------------------------------', 'yellow')
    log('🏁  Auditoría Finalizada', 'yellow')

  } catch (error) {
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
