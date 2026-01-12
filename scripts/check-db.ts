import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Verificando estado de la base de datos...\n')

    // Contar clientes
    const customerCount = await prisma.customer.count()
    console.log(`📊 Total de clientes: ${customerCount}`)

    // Listar clientes
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        nombre: true,
        apellido: true,
        activo: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    console.log('\n👥 Últimos clientes registrados:')
    customers.forEach(customer => {
      console.log(`  - ${customer.nombre} ${customer.apellido || ''} (${customer.email})`)
      console.log(`    Username: ${customer.username}, Activo: ${customer.activo}`)
    })

    console.log('\n✅ Verificación completada')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
