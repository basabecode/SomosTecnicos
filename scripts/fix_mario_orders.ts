
import { prisma } from '../lib/prisma'

async function main() {
  console.log('Fixing orders for Mario...')
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

  if (user.ciudad !== 'Cali') {
      console.log(`User city is ${user.ciudad}, expected Cali. Updating user...`)
      const updated = await prisma.customer.update({
          where: { id: user.id },
          data: { ciudad: 'Cali' }
      })
      console.log('User updated:', updated)
  } else {
      console.log('User city is correctly set to Cali')
  }

  // Update orders
  const result = await prisma.order.updateMany({
    where: {
        customerId: user.id,
        ciudad: 'Bogotá'
    },
    data: {
        ciudad: 'Cali'
    }
  })

  console.log(`Updated ${result.count} orders to Cali.`)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
