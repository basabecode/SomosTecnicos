/**
 * API de Health Check del Sistema
 * GET /api/system/health - Estado de salud completo del sistema
 */

import { NextResponse } from 'next/server'
import { getDatabaseHealth, getConnectionPoolStats } from '@/lib/prisma'
import { getCacheStats } from '@/lib/cache'
import { getQueueStats } from '@/lib/queue'
import { logger } from '@/lib/logger'

// =============================================
// GET /api/system/health - Health check completo
// =============================================

export async function GET(request: Request) {
  const startTime = Date.now()
  
  try {
    // Obtener todas las estadísticas en paralelo
    const [
      databaseHealth,
      cacheStats,
      queueStats,
      connectionPoolStats
    ] = await Promise.all([
      getDatabaseHealth(),
      Promise.resolve(getCacheStats()),
      Promise.resolve(getQueueStats()),
      Promise.resolve(getConnectionPoolStats())
    ])

    // Determinar estado general del sistema
    const systemStatus = databaseHealth.status === 'healthy' ? 'healthy' : 'degraded'
    const responseTime = Date.now() - startTime

    // Verificar si hay problemas
    const issues = []
    if (databaseHealth.status !== 'healthy') {
      issues.push('Database connection issues')
    }
    if (connectionPoolStats.circuitBreakerState.isActive) {
      issues.push('Database circuit breaker active')
    }
    if (queueStats.total > 1000) {
      issues.push('High queue backlog')
    }

    const healthData = {
      status: systemStatus,
      timestamp: new Date().toISOString(),
      responseTime,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      
      // Componentes del sistema
      components: {
        database: databaseHealth,
        cache: {
          status: 'healthy',
          stats: cacheStats
        },
        queue: {
          status: queueStats.total > 1000 ? 'warning' : 'healthy',
          stats: queueStats
        },
        connectionPool: {
          status: connectionPoolStats.circuitBreakerState.isActive ? 'unhealthy' : 'healthy',
          stats: connectionPoolStats
        }
      },

      // Métricas del sistema
      metrics: {
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024)
        },
        cpu: {
          usage: process.cpuUsage()
        }
      },

      // Issues detectados
      issues: issues.length > 0 ? issues : null,
      
      // Metadata
      checks: {
        database: databaseHealth.status === 'healthy',
        cache: true,
        queue: queueStats.total < 1000,
        circuitBreaker: !connectionPoolStats.circuitBreakerState.isActive
      }
    }

    // Log del health check
    logger.info(`Health check completed: ${systemStatus} (${responseTime}ms)`)

    return NextResponse.json(healthData, {
      status: systemStatus === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    logger.error('Health check failed:', error as Error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      error: (error as Error).message,
      components: {
        database: { status: 'unknown' },
        cache: { status: 'unknown' },
        queue: { status: 'unknown' },
        connectionPool: { status: 'unknown' }
      }
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
  }
}

// =============================================
// HEAD /api/system/health - Health check liviano
// =============================================

export async function HEAD() {
  try {
    // Solo verificar la base de datos para HEAD request
    const isHealthy = await getDatabaseHealth()
    
    return new NextResponse(null, {
      status: isHealthy.status === 'healthy' ? 200 : 503,
      headers: {
        'X-Health-Status': isHealthy.status,
        'X-Response-Time': isHealthy.responseTime?.toString() || '0',
        'Cache-Control': 'no-cache'
      }
    })
    
  } catch (error) {
    return new NextResponse(null, {
      status: 503,
      headers: {
        'X-Health-Status': 'error',
        'Cache-Control': 'no-cache'
      }
    })
  }
}