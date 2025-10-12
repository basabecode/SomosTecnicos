/**
 * Script de verificación de cuentas de clientes
 */

import { prisma } from '../lib/prisma'

async function verifyCustomerAccounts() {
  try {
    console.log('🔍 Verificando cuentas de clientes...')

    // Buscar todos los clientes
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        nombre: true,
        apellido: true,
        activo: true,
        createdAt: true
      }
    })

    console.log(`\n📊 Total de clientes encontrados: ${customers.length}`)

    if (customers.length === 0) {
      console.log('❌ No se encontraron clientes en la base de datos')
      return
    }

    console.log('\n👥 Lista de clientes:')
    customers.forEach((customer, index) => {
      console.log(`${index + 1}. ${customer.email}`)
      console.log(`   - Nombre: ${customer.nombre} ${customer.apellido || ''}`)
      console.log(`   - Usuario: ${customer.username}`)
      console.log(`   - Activo: ${customer.activo ? '✅' : '❌'}`)
      console.log(`   - Creado: ${customer.createdAt.toLocaleString('es-CO')}`)
      console.log('')
    })

    // Verificar específicamente las cuentas de CUENTAS_PRUEBA.md
    const testEmails = [
      'cliente.demo@tecnocity.com',
      'cliente.vip@tecnocity.com',
      'cliente.norte@tecnocity.com'
    ]

    console.log('🎯 Verificando cuentas específicas de prueba:')
    for (const email of testEmails) {
      const customer = await prisma.customer.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          nombre: true,
          activo: true,
          passwordHash: true
        }
      })

      if (customer) {
        console.log(`✅ ${email} - Encontrado (ID: ${customer.id}, Activo: ${customer.activo})`)
        console.log(`   - Hash de contraseña: ${customer.passwordHash ? '✅ Existe' : '❌ No existe'}`)
      } else {
        console.log(`❌ ${email} - NO encontrado`)
      }
    }

  } catch (error) {
    console.error('❌ Error verificando cuentas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyCustomerAccounts()
