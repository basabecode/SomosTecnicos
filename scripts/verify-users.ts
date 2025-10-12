/**
 * Script para verificar usuarios existentes en la base de datos
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyUsers() {
  try {
    console.log('🔍 Verificando usuarios en la base de datos...')

    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        nombre: true,
        apellido: true,
        role: true,
        activo: true,
        createdAt: true
      }
    })

    console.log(`📊 Total de usuarios: ${users.length}`)
    console.log('\n📋 Lista de usuarios:')

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nombre} ${user.apellido || ''}`)
      console.log(`   📧 Email: ${user.email}`)
      console.log(`   👤 Username: ${user.username}`)
      console.log(`   🔒 Role: ${user.role}`)
      console.log(`   ✅ Activo: ${user.activo ? 'Sí' : 'No'}`)
      console.log(`   📅 Creado: ${user.createdAt.toLocaleString('es-CO')}`)
      console.log('')
    })

    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        activo: true,
        createdAt: true
      }
    })

    console.log(`
👥 Clientes registrados: ${customers.length}`)
    customers.forEach((customer, index) => {
      console.log(`${index + 1}. ${customer.nombre} ${customer.apellido || ''}`)
      console.log(`   📧 Email: ${customer.email}`)
      console.log(`   👤 Username: ${customer.username}`)
      console.log(`   📱 Teléfono: ${customer.telefono}`)
      console.log(`   ✅ Activo: ${customer.activo ? 'Sí' : 'No'}`)
      console.log(`   📅 Creado: ${customer.createdAt.toLocaleString('es-CO')}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error al verificar usuarios:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar la verificación
verifyUsers()
