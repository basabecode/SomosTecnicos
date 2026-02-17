
import { prisma } from '../lib/prisma'

async function main() {
  console.log('Verifying user Mario...')
  const user = await prisma.customer.findFirst({
    where: {
      OR: [
        { nombre: { contains: 'Mario', mode: 'insensitive' } },
        { email: { contains: 'mario', mode: 'insensitive' } }
      ]
    }
  })

  if (!user) {
    console.log('User Mario not found')
    return
  }

  console.log('User found:', {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    ciudad: user.ciudad,
    direccion: user.direccion
  })

  console.log('Checking recent orders for this user...')
  const orders = await prisma.order.findMany({
    where: { customerId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 3
  })

  orders.forEach(o => {
    console.log(`Order ${o.orderNumber}: Ciudad=${o.ciudad}, CreatedAt=${o.createdAt}`)
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
