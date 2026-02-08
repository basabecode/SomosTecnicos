// Script para verificar tokens de recuperación de contraseña
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkTokens() {
  try {
    const tokens = await prisma.passwordResetToken.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        token: true,
        userEmail: true,
        userType: true,
        expiresAt: true,
        used: true,
        createdAt: true
      }
    })

    console.log('\n📧 Tokens de Recuperación de Contraseña:')
    console.log('==========================================\n')

    if (tokens.length === 0) {
      console.log('❌ No se encontraron tokens')
    } else {
      tokens.forEach((token, index) => {
        console.log(`Token #${index + 1}:`)
        console.log(`  Email: ${token.userEmail}`)
        console.log(`  Tipo: ${token.userType}`)
        console.log(`  Token: ${token.token.substring(0, 20)}...`)
        console.log(`  Expira: ${token.expiresAt.toLocaleString()}`)
        console.log(`  Usado: ${token.used ? '✅ Sí' : '❌ No'}`)
        console.log(`  Creado: ${token.createdAt.toLocaleString()}`)
        console.log('')
      })
    }

    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

checkTokens()
