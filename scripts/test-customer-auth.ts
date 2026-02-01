/**
 * Script de prueba de autenticación de clientes
 */

import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import { authenticateCustomer } from '../lib/auth'

async function testCustomerAuth() {
  try {
    const testCredentials = [
      { email: 'cliente.demo@somostecnicos.com', password: process.env.DEMO_CLIENT_PASSWORD || 'ChangeMe2026!' }
    ]

    console.log('🔐 Probando autenticación de clientes...\n')

    for (const cred of testCredentials) {
      console.log(`🧪 Probando: ${cred.email}`)

      // 1. Verificar que el cliente existe
      const customer = await prisma.customer.findUnique({
        where: { email: cred.email },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          nombre: true,
          activo: true
        }
      })

      if (!customer) {
        console.log(`   ❌ Cliente no encontrado en BD`)
        continue
      }

      console.log(`   ✅ Cliente encontrado: ${customer.nombre} (ID: ${customer.id})`)
      console.log(`   📊 Activo: ${customer.activo}`)

      // 2. Probar comparación de contraseña directamente
      const isValidPassword = await bcrypt.compare(cred.password, customer.passwordHash)
      console.log(`   🔑 Contraseña válida: ${isValidPassword ? '✅' : '❌'}`)

      if (!isValidPassword) {
        console.log(`   🔍 Hash esperado: ${customer.passwordHash}`)
        console.log(`   🔍 Contraseña probada: ${cred.password}`)

        // Generar nuevo hash para comparar
        const testHash = await bcrypt.hash(cred.password, 10)
        console.log(`   🔍 Nuevo hash generado: ${testHash}`)
      }

      // 3. Probar función authenticateCustomer
      const authResult = await authenticateCustomer(cred.email, cred.password)
      console.log(`   🎯 Función authenticateCustomer: ${authResult ? '✅ Exitoso' : '❌ Falló'}`)

      if (authResult) {
        console.log(`      - ID: ${authResult.id}`)
        console.log(`      - Nombre: ${authResult.nombre}`)
        console.log(`      - Role: ${authResult.role}`)
        console.log(`      - UserType: ${authResult.userType}`)
      }

      console.log('')
    }

  } catch (error) {
    console.error('❌ Error en prueba de autenticación:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCustomerAuth()
