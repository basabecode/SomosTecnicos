/**
 * Cliente de Prisma para la aplicación
 * Configuración optimizada para desarrollo y producción
 */

import { PrismaClient } from '@prisma/client'

// Declaración global para evitar múltiples instancias en desarrollo
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Cliente de Prisma singleton
 * En desarrollo reutiliza la instancia para evitar límites de conexión
 * En producción crea una nueva instancia
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
})

// En desarrollo, guardar la instancia en global para reutilizarla
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

/**
 * Función para cerrar la conexión de Prisma
 * Útil para cleanup en tests y shutdown de la aplicación
 */
export async function disconnectPrisma() {
  await prisma.$disconnect()
}

/**
 * Función para verificar la conexión a la base de datos
 */
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Conexión a la base de datos exitosa')
    return true
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error)
    return false
  }
}

/**
 * Función para obtener estadísticas de la base de datos
 */
export async function getDatabaseStats() {
  try {
    const [orders, technicians, notifications] = await Promise.all([
      prisma.order.count(),
      prisma.technician.count(),
      prisma.notification.count()
    ])

    return {
      orders,
      technicians,
      notifications,
      timestamp: new Date()
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas de BD:', error)
    throw error
  }
}

/**
 * Función de cleanup para el cierre de la aplicación
 */
process.on('beforeExit', async () => {
  await disconnectPrisma()
})
