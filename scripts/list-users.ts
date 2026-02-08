// Script para listar usuarios admin
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listUsers() {
  try {
    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        role: true
      }
    })

    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true
      },
      take: 5
    })

    console.log('\n👤 Usuarios Admin:')
    console.log('==================\n')
    admins.forEach(admin => {
      console.log(`  ${admin.email} - ${admin.nombre} ${admin.apellido || ''} (${admin.role})`)
    })

    console.log('\n👥 Clientes (primeros 5):')
    console.log('=========================\n')
    customers.forEach(customer => {
      console.log(`  ${customer.email} - ${customer.nombre} ${customer.apellido || ''}`)
    })

    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

listUsers()
