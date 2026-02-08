// Script para obtener el último token
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getLatestToken() {
  try {
    const token = await prisma.passwordResetToken.findFirst({
      where: { used: false },
      orderBy: { createdAt: 'desc' }
    })

    if (token) {
      console.log(token.token)
    } else {
      console.log('No token found')
    }

    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

getLatestToken()
