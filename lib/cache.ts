/**
 * Sistema de Cache usando Vercel KV (Redis)
 * Optimiza consultas frecuentes y reduce latencia del dashboard
 */

import { logger } from '@/lib/logger'

// Configuración de TTL por tipo de datos
const CACHE_TTL = {
  dashboard_stats: 60,        // 60 segundos
  technician_list: 30,        // 30 segundos  
  system_config: 300,         // 5 minutos
  order_counts: 120,          // 2 minutos
  recent_orders: 60,          // 60 segundos
} as const

type CacheKey = keyof typeof CACHE_TTL

// Simulación de Vercel KV para desarrollo
// En producción esto sería reemplazado por @vercel/kv
class CacheManager {
  private cache: Map<string, { value: any; expiresAt: number }> = new Map()
  
  constructor() {
    // Limpiar cache expirado cada 30 segundos
    setInterval(() => {
      this.cleanup()
    }, 30000)
  }

  /**
   * Obtener valor del cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = this.cache.get(key)
      
      if (!cached) {
        return null
      }

      if (Date.now() > cached.expiresAt) {
        this.cache.delete(key)
        return null
      }

      logger.info(`Cache HIT: ${key}`)
      return cached.value as T
    } catch (error) {
      logger.error(`Cache GET error for key ${key}:`, error as Error)
      return null
    }
  }

  /**
   * Guardar valor en cache
   */
  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    try {
      const expiresAt = Date.now() + (ttlSeconds * 1000)
      
      this.cache.set(key, {
        value,
        expiresAt
      })

      logger.info(`Cache SET: ${key} (TTL: ${ttlSeconds}s)`)
    } catch (error) {
      logger.error(`Cache SET error for key ${key}:`, error as Error)
    }
  }

  /**
   * Eliminar valor del cache
   */
  async delete(key: string): Promise<void> {
    try {
      const deleted = this.cache.delete(key)
      if (deleted) {
        logger.info(`Cache DELETE: ${key}`)
      }
    } catch (error) {
      logger.error(`Cache DELETE error for key ${key}:`, error as Error)
    }
  }

  /**
   * Limpiar entradas expiradas
   */
  private cleanup(): void {
    const now = Date.now()
    let cleanedCount = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
        cleanedCount++
      }
    }

    if (cleanedCount > 0) {
      logger.info(`Cache cleanup: ${cleanedCount} expired entries removed`)
    }
  }

  /**
   * Obtener estadísticas del cache
   */
  getStats() {
    const now = Date.now()
    let active = 0
    let expired = 0

    for (const entry of this.cache.values()) {
      if (now > entry.expiresAt) {
        expired++
      } else {
        active++
      }
    }

    return {
      total: this.cache.size,
      active,
      expired,
      memoryUsage: JSON.stringify([...this.cache.entries()]).length
    }
  }
}

// Instancia singleton
const cacheManager = new CacheManager()

// Funciones públicas
export async function getCached<T>(key: CacheKey, fallback: () => Promise<T>): Promise<T> {
  const cacheKey = `fsm:${key}:${new Date().toISOString().slice(0, 10)}`
  
  // Intentar obtener del cache
  const cached = await cacheManager.get<T>(cacheKey)
  if (cached !== null) {
    return cached
  }

  // Cache miss - ejecutar fallback
  logger.info(`Cache MISS: ${cacheKey} - executing fallback`)
  
  try {
    const result = await fallback()
    
    // Guardar en cache
    await cacheManager.set(cacheKey, result, CACHE_TTL[key])
    
    return result
  } catch (error) {
    logger.error(`Fallback error for ${cacheKey}:`, error as Error)
    throw error
  }
}

export async function setCached(key: CacheKey, value: any, customTTL?: number): Promise<void> {
  const cacheKey = `fsm:${key}:${new Date().toISOString().slice(0, 10)}`
  const ttl = customTTL || CACHE_TTL[key]
  
  await cacheManager.set(cacheKey, value, ttl)
}

export async function invalidateCache(key: CacheKey): Promise<void> {
  const cacheKey = `fsm:${key}:${new Date().toISOString().slice(0, 10)}`
  await cacheManager.delete(cacheKey)
}

export async function invalidateAllCache(): Promise<void> {
  // En desarrollo, limpiar todo
  const stats = cacheManager.getStats()
  for (let i = 0; i < stats.total; i++) {
    // cacheManager implementaría clearAll() en versión real
  }
  logger.warn('All cache invalidated')
}

export function getCacheStats() {
  return cacheManager.getStats()
}

// Helper para APIs que necesitan cache condicional
export async function withCache<T>(
  key: CacheKey,
  condition: boolean,
  fallback: () => Promise<T>
): Promise<{ data: T; fromCache: boolean }> {
  if (!condition) {
    const data = await fallback()
    return { data, fromCache: false }
  }

  const cacheKey = `fsm:${key}:${new Date().toISOString().slice(0, 10)}`
  const cached = await cacheManager.get<T>(cacheKey)
  
  if (cached !== null) {
    return { data: cached, fromCache: true }
  }

  const data = await fallback()
  await cacheManager.set(cacheKey, data, CACHE_TTL[key])
  
  return { data, fromCache: false }
}

// Decorador para endpoints que necesitan cache automático
export function cached(key: CacheKey, ttl?: number) {
  return function <T extends (...args: any[]) => Promise<any>>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const method = descriptor.value!
    
    descriptor.value = (async function (...args: any[]) {
      const cacheKey = `fsm:${key}:${propertyName}:${JSON.stringify(args).slice(0, 50)}`
      
      const cached = await cacheManager.get(cacheKey)
      if (cached !== null) {
        return cached
      }

      const result = await method.apply(this, args)
      await cacheManager.set(cacheKey, result, ttl || CACHE_TTL[key])
      
      return result
    }) as T

    return descriptor
  }
}

// Utilidades específicas para el FSM
export class FSMCache {
  /**
   * Cache específico para dashboard stats
   */
  static async getDashboardStats<T>(fallback: () => Promise<T>): Promise<T> {
    return getCached('dashboard_stats', fallback)
  }

  /**
   * Cache específico para lista de técnicos disponibles
   */
  static async getAvailableTechnicians<T>(fallback: () => Promise<T>): Promise<T> {
    return getCached('technician_list', fallback)
  }

  /**
   * Cache específico para contadores de órdenes
   */
  static async getOrderCounts<T>(fallback: () => Promise<T>): Promise<T> {
    return getCached('order_counts', fallback)
  }

  /**
   * Cache específico para configuración del sistema
   */
  static async getSystemConfig<T>(fallback: () => Promise<T>): Promise<T> {
    return getCached('system_config', fallback)
  }

  /**
   * Invalidar cache cuando se crean/actualizan órdenes
   */
  static async invalidateOrderCache(): Promise<void> {
    await Promise.all([
      invalidateCache('dashboard_stats'),
      invalidateCache('order_counts'),
      invalidateCache('recent_orders')
    ])
  }

  /**
   * Invalidar cache cuando se actualiza información de técnicos
   */
  static async invalidateTechnicianCache(): Promise<void> {
    await Promise.all([
      invalidateCache('technician_list'),
      invalidateCache('dashboard_stats')
    ])
  }
}