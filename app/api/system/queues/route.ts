/**
 * API de Monitoreo de Colas
 * GET /api/system/queues - Estadísticas detalladas de las colas
 */

import { NextResponse } from 'next/server'
import { getQueueStats, clearQueue } from '@/lib/queue'
import { getCacheStats } from '@/lib/cache'
import { requireTechnicianManager } from '@/lib/auth'

// =============================================
// GET /api/system/queues - Estadísticas de colas
// =============================================

export async function GET(request: Request) {
  // Verificar permisos administrativos
  const authCheck = await requireTechnicianManager(request as any)
  if (!authCheck.authorized) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    )
  }

  try {
    const queueStats = getQueueStats()
    const cacheStats = getCacheStats()
    
    // Métricas adicionales
    const timestamp = new Date()
    const totalJobs = queueStats.total
    
    // Determinar estado de las colas
    let queueStatus = 'healthy'
    const alerts = []
    
    if (totalJobs > 1000) {
      queueStatus = 'warning'
      alerts.push('High queue backlog - consider scaling')
    }
    
    if (totalJobs > 5000) {
      queueStatus = 'critical'
      alerts.push('Critical queue backlog - immediate attention required')
    }
    
    if (queueStats.processing.length === 0 && totalJobs > 0) {
      alerts.push('Queue processor appears to be stuck')
    }

    const response = {
      status: queueStatus,
      timestamp: timestamp.toISOString(),
      
      // Estadísticas de colas por prioridad
      queues: {
        high: {
          pending: queueStats.high,
          description: 'Critical operations (notifications, emails)'
        },
        medium: {
          pending: queueStats.medium,
          description: 'Standard operations (audit logs)'
        },
        low: {
          pending: queueStats.low,
          description: 'Background operations (cleanup, reports)'
        }
      },
      
      // Estadísticas generales
      summary: {
        totalJobs,
        activeProcessors: queueStats.processing.length,
        processingQueues: queueStats.processing
      },
      
      // Estadísticas del cache (relacionado con performance)
      cache: {
        status: 'healthy',
        entries: {
          total: cacheStats.total,
          active: cacheStats.active,
          expired: cacheStats.expired
        },
        memory: `${Math.round(cacheStats.memoryUsage / 1024)} KB`
      },
      
      // Alertas y recomendaciones
      alerts: alerts.length > 0 ? alerts : null,
      
      // Recomendaciones basadas en métricas
      recommendations: generateRecommendations(queueStats, cacheStats),
      
      // Metadata para debugging
      metadata: {
        environment: process.env.NODE_ENV,
        uptime: process.uptime(),
        nodeVersion: process.version
      }
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, max-age=0',
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Error getting queue stats:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: (error as Error).message,
      queues: null,
      summary: null
    }, {
      status: 500
    })
  }
}

/**
 * Generar recomendaciones basadas en métricas actuales
 */
function generateRecommendations(queueStats: any, cacheStats: any): string[] {
  const recommendations = []
  
  // Recomendaciones para colas
  if (queueStats.total > 100) {
    recommendations.push('Consider increasing queue processor frequency')
  }
  
  if (queueStats.high > 50) {
    recommendations.push('High priority queue is backed up - check for stuck jobs')
  }
  
  // Recomendaciones para cache
  if (cacheStats.expired > cacheStats.active) {
    recommendations.push('High cache expiration rate - consider increasing TTL values')
  }
  
  if (cacheStats.total === 0) {
    recommendations.push('Cache is empty - verify cache configuration')
  }
  
  // Recomendaciones generales
  if (queueStats.processing.length === 0 && queueStats.total > 0) {
    recommendations.push('Queue processor may be stopped - restart background services')
  }
  
  return recommendations
}

// =============================================
// POST /api/system/queues/clear - Limpiar colas (emergency)
// =============================================

export async function POST(request: Request) {
  const authCheck = await requireTechnicianManager(request as any)
  if (!authCheck.authorized) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { action, queue } = body
    
    if (action !== 'clear') {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    const validPriorities = ['high', 'medium', 'low']
    if (queue && !validPriorities.includes(queue)) {
      return NextResponse.json(
        { error: `Invalid queue. Must be one of: ${validPriorities.join(', ')}` },
        { status: 400 }
      )
    }

    const discarded = clearQueue(queue || undefined)
    console.warn(`Queue clear executed by admin: ${queue || 'all'} — ${discarded} jobs discarded`)

    return NextResponse.json({
      success: true,
      message: `Cola "${queue || 'all'}" limpiada. ${discarded} jobs descartados.`,
      discarded,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, {
      status: 500
    })
  }
}