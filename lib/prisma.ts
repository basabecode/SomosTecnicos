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
 * Cliente de Prisma singleton con configuración optimizada
 * En desarrollo reutiliza la instancia para evitar límites de conexión
 * En producción optimiza el pool de conexiones para alta concurrencia
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // ✅ Configuración optimizada del pool de conexiones
  connectionPool: {
    timeout: 20, // 20 segundos timeout para queries
    maxIdleConnections: 5, // Conexiones idle mínimas
    maxConnections: process.env.NODE_ENV === 'production' ? 25 : 10, // Más conexiones en producción
  },
  // ✅ Configuración de query timeouts
  queryTimeout: 15000, // 15 segundos máximo por query
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

// ✅ Circuit breaker simple para la base de datos
let connectionFailures = 0
let lastFailureTime = 0
const MAX_FAILURES = 3
const FAILURE_TIMEOUT = 30000 // 30 segundos

/**
 * Función para verificar la conexión a la base de datos con timeout y circuit breaker
 */
export async function checkDatabaseConnection(timeoutMs = 5000): Promise<boolean> {
  // Circuit breaker - si hay demasiados fallos, no intentar por un tiempo
  if (connectionFailures >= MAX_FAILURES && Date.now() - lastFailureTime < FAILURE_TIMEOUT) {
    console.warn('🔴 Circuit breaker activo - demasiados fallos de BD')
    return false
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), timeoutMs)
      )
    ])
    
    clearTimeout(timeout)
    
    // Reset circuit breaker en caso de éxito
    connectionFailures = 0
    console.log('✅ Conexión a la base de datos exitosa')
    return true
    
  } catch (error) {
    clearTimeout(timeout)
    connectionFailures++
    lastFailureTime = Date.now()
    
    console.error(`❌ Error conectando a la base de datos (fallo ${connectionFailures}/${MAX_FAILURES}):`, error)
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
 * Obtener estadísticas del pool de conexiones
 */
export function getConnectionPoolStats() {
  return {
    maxConnections: process.env.NODE_ENV === 'production' ? 25 : 10,
    maxIdleConnections: 5,
    queryTimeout: 15000,
    connectionTimeout: 20,
    circuitBreakerState: {
      failures: connectionFailures,
      lastFailureTime: lastFailureTime,
      isActive: connectionFailures >= MAX_FAILURES && Date.now() - lastFailureTime < FAILURE_TIMEOUT
    }
  }
}

/**
 * Ejecutar query con retry automático y circuit breaker
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 2,
  backoffMs = 1000
): Promise<T> {
  // Verificar circuit breaker
  if (connectionFailures >= MAX_FAILURES && Date.now() - lastFailureTime < FAILURE_TIMEOUT) {
    throw new Error('Circuit breaker activo - base de datos no disponible')
  }

  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation()
      
      // Reset circuit breaker en caso de éxito
      connectionFailures = 0
      return result
      
    } catch (error) {
      lastError = error as Error
      connectionFailures++
      lastFailureTime = Date.now()
      
      console.warn(`Query failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error)
      
      if (attempt < maxRetries) {
        // Backoff exponencial
        await new Promise(resolve => setTimeout(resolve, backoffMs * Math.pow(2, attempt)))
      }
    }
  }
  
  throw lastError!
}

/**
 * Health check completo de la base de datos
 */
export async function getDatabaseHealth() {
  const startTime = Date.now()
  
  try {
    const isConnected = await checkDatabaseConnection()
    const stats = await getDatabaseStats()
    const poolStats = getConnectionPoolStats()
    
    return {
      status: isConnected ? 'healthy' : 'unhealthy',
      responseTime: Date.now() - startTime,
      connection: {
        active: isConnected,
        circuitBreaker: poolStats.circuitBreakerState
      },
      pool: poolStats,
      data: stats,
      timestamp: new Date()
    }
  } catch (error) {
    return {
      status: 'error',
      responseTime: Date.now() - startTime,
      error: (error as Error).message,
      timestamp: new Date()
    }
  }
}

/**
 * Función de cleanup para el cierre de la aplicación
 */
process.on('beforeExit', async () => {
  console.log('🔄 Cerrando conexiones de Prisma...')
  await disconnectPrisma()
})

// Manejo de señales para shutdown graceful
process.on('SIGTERM', async () => {
  console.log('📡 SIGTERM recibido, cerrando conexiones...')
  await disconnectPrisma()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('📡 SIGINT recibido, cerrando conexiones...')
  await disconnectPrisma()
  process.exit(0)
})
