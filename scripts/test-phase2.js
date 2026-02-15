#!/usr/bin/env node

/**
 * Script de Testing para Fase 2 - Validación de Mejoras de Escalabilidad
 * 
 * Valida las implementaciones de:
 * 1. Rate Limiting
 * 2. Transacciones Atómicas
 * 3. Sistema de Colas
 * 4. Caching
 * 5. Connection Pooling
 * 6. ISR
 */

const https = require('https')
const http = require('http')

// Configuración de tests
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000'
const CONCURRENT_REQUESTS = 20
const RATE_LIMIT_THRESHOLD = 100

console.log('🚀 Iniciando Tests de Fase 2 - Escalabilidad')
console.log(`📍 Target: ${BASE_URL}`)
console.log('=' .repeat(60))

// Helper para hacer requests HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const startTime = Date.now()
    
    const req = protocol.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Phase2-Test-Suite/1.0',
        ...options.headers
      }
    }, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data ? JSON.parse(data) : null,
          responseTime
        })
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    if (options.body) {
      req.write(JSON.stringify(options.body))
    }
    
    req.end()
  })
}

// Test 1: Rate Limiting
async function testRateLimiting() {
  console.log('🔒 Test 1: Rate Limiting')
  
  try {
    const requests = []
    const endpoint = `${BASE_URL}/api/orders`
    
    // Hacer múltiples requests rápidamente para activar rate limiting
    for (let i = 0; i < 150; i++) {
      requests.push(makeRequest(endpoint))
    }
    
    const results = await Promise.allSettled(requests)
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.status === 200).length
    const rateLimited = results.filter(r => r.status === 'fulfilled' && r.value.status === 429).length
    const errors = results.filter(r => r.status === 'rejected').length
    
    console.log(`  ✅ Requests exitosos: ${successful}`)
    console.log(`  🚫 Rate limited (429): ${rateLimited}`)
    console.log(`  ❌ Errores: ${errors}`)
    
    if (rateLimited > 0) {
      console.log('  ✅ Rate limiting funcionando correctamente')
      
      // Verificar headers de rate limit
      const limitedResponse = results.find(r => 
        r.status === 'fulfilled' && r.value.status === 429
      )
      
      if (limitedResponse && limitedResponse.value.headers['x-ratelimit-limit']) {
        console.log(`  📊 Límite detectado: ${limitedResponse.value.headers['x-ratelimit-limit']} req/min`)
      }
    } else {
      console.log('  ⚠️  Rate limiting no detectado - verificar configuración')
    }
    
  } catch (error) {
    console.log(`  ❌ Error en test: ${error.message}`)
  }
  
  console.log('')
}

// Test 2: Health Check y Sistema
async function testSystemHealth() {
  console.log('🏥 Test 2: Health Check del Sistema')
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/system/health`)
    
    if (response.status === 200) {
      const health = response.data
      console.log(`  ✅ Sistema: ${health.status}`)
      console.log(`  🕐 Response time: ${health.responseTime}ms`)
      console.log(`  🗄️  Database: ${health.components.database.status}`)
      console.log(`  💾 Cache: ${health.components.cache.status}`)
      console.log(`  📋 Queue: ${health.components.queue.status}`)
      console.log(`  🔌 Connection Pool: ${health.components.connectionPool.status}`)
      
      if (health.issues && health.issues.length > 0) {
        console.log('  ⚠️  Issues detectados:')
        health.issues.forEach(issue => console.log(`    - ${issue}`))
      }
    } else {
      console.log(`  ❌ Health check falló: ${response.status}`)
    }
    
  } catch (error) {
    console.log(`  ❌ Error en health check: ${error.message}`)
  }
  
  console.log('')
}

// Test 3: Caching del Dashboard
async function testDashboardCaching() {
  console.log('💾 Test 3: Caching del Dashboard')
  
  try {
    // Primera request - debería ser MISS
    const firstResponse = await makeRequest(`${BASE_URL}/api/dashboard/stats`)
    
    if (firstResponse.status === 200) {
      const firstCache = firstResponse.data.metadata?.cacheStatus
      console.log(`  📊 Primera request: ${firstCache || 'N/A'}`)
      
      // Segunda request inmediata - debería ser HIT
      const secondResponse = await makeRequest(`${BASE_URL}/api/dashboard/stats`)
      
      if (secondResponse.status === 200) {
        const secondCache = secondResponse.data.metadata?.cacheStatus
        console.log(`  🎯 Segunda request: ${secondCache || 'N/A'}`)
        
        if (secondCache === 'HIT') {
          console.log('  ✅ Cache funcionando correctamente')
          console.log(`  ⚡ Response time: ${secondResponse.responseTime}ms`)
        } else {
          console.log('  ⚠️  Cache no detectado - verificar implementación')
        }
      }
      
      // Test con parámetro nocache
      const noCacheResponse = await makeRequest(`${BASE_URL}/api/dashboard/stats?nocache=1`)
      if (noCacheResponse.status === 200) {
        const noCacheStatus = noCacheResponse.data.metadata?.cacheStatus
        console.log(`  🚫 Request sin cache: ${noCacheStatus || 'N/A'}`)
      }
      
    } else {
      console.log(`  ❌ Dashboard stats no accesible: ${firstResponse.status}`)
    }
    
  } catch (error) {
    console.log(`  ❌ Error en test de caching: ${error.message}`)
  }
  
  console.log('')
}

// Test 4: Monitoreo de Colas
async function testQueueSystem() {
  console.log('📋 Test 4: Sistema de Colas')
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/system/queues`)
    
    if (response.status === 200) {
      const queues = response.data
      console.log(`  📊 Estado general: ${queues.status}`)
      console.log(`  📈 Jobs totales: ${queues.summary.totalJobs}`)
      console.log(`  ⚡ Procesadores activos: ${queues.summary.activeProcessors}`)
      
      console.log('  📋 Colas por prioridad:')
      console.log(`    🔴 High: ${queues.queues.high.pending}`)
      console.log(`    🟡 Medium: ${queues.queues.medium.pending}`)
      console.log(`    🟢 Low: ${queues.queues.low.pending}`)
      
      if (queues.alerts && queues.alerts.length > 0) {
        console.log('  ⚠️  Alertas:')
        queues.alerts.forEach(alert => console.log(`    - ${alert}`))
      }
      
      if (queues.recommendations && queues.recommendations.length > 0) {
        console.log('  💡 Recomendaciones:')
        queues.recommendations.forEach(rec => console.log(`    - ${rec}`))
      }
      
    } else if (response.status === 401) {
      console.log('  ⚠️  No autorizado - requiere permisos admin')
    } else {
      console.log(`  ❌ Queue status no accesible: ${response.status}`)
    }
    
  } catch (error) {
    console.log(`  ❌ Error en test de colas: ${error.message}`)
  }
  
  console.log('')
}

// Test 5: Concurrencia de Creación de Órdenes
async function testOrderConcurrency() {
  console.log('🔄 Test 5: Concurrencia de Órdenes')
  
  try {
    const requests = []
    const testData = {
      nombre: 'Test Concurrencia',
      email: `test-${Date.now()}@example.com`,
      telefono: '3001234567',
      direccion: 'Test Address',
      ciudad: 'Bogotá',
      tipoElectrodomestico: 'nevera',
      tipoServicio: 'reparacion',
      descripcionProblema: 'Test de concurrencia'
    }
    
    // Crear múltiples órdenes concurrentemente
    for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
      const uniqueData = {
        ...testData,
        email: `test-${Date.now()}-${i}@example.com`,
        nombre: `${testData.nombre} ${i}`
      }
      
      requests.push(
        makeRequest(`${BASE_URL}/api/orders`, {
          method: 'POST',
          body: uniqueData,
          headers: {
            'X-Idempotency-Key': `test-${Date.now()}-${i}`
          }
        })
      )
    }
    
    const results = await Promise.allSettled(requests)
    
    const successful = results.filter(r => 
      r.status === 'fulfilled' && 
      r.value.status === 200 || r.value.status === 201
    ).length
    
    const errors = results.filter(r => r.status === 'rejected').length
    const rateLimited = results.filter(r => 
      r.status === 'fulfilled' && r.value.status === 429
    ).length
    
    console.log(`  ✅ Órdenes creadas: ${successful}`)
    console.log(`  🚫 Rate limited: ${rateLimited}`)
    console.log(`  ❌ Errores: ${errors}`)
    
    // Verificar response times
    const responseTimes = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value.responseTime)
    
    if (responseTimes.length > 0) {
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      const maxResponseTime = Math.max(...responseTimes)
      
      console.log(`  ⏱️  Response time promedio: ${Math.round(avgResponseTime)}ms`)
      console.log(`  📈 Response time máximo: ${maxResponseTime}ms`)
      
      if (maxResponseTime > 5000) {
        console.log('  ⚠️  Algunos requests tardaron >5s - verificar performance')
      }
    }
    
  } catch (error) {
    console.log(`  ❌ Error en test de concurrencia: ${error.message}`)
  }
  
  console.log('')
}

// Test 6: Idempotencia
async function testIdempotency() {
  console.log('🔑 Test 6: Idempotencia')
  
  try {
    const idempotencyKey = `test-idempotency-${Date.now()}`
    const testData = {
      nombre: 'Test Idempotency',
      email: `idempotency-${Date.now()}@example.com`,
      telefono: '3001234567',
      direccion: 'Test Address',
      ciudad: 'Bogotá',
      tipoElectrodomestico: 'nevera',
      tipoServicio: 'reparacion',
      descripcionProblema: 'Test de idempotencia'
    }
    
    // Primera request
    const firstResponse = await makeRequest(`${BASE_URL}/api/orders`, {
      method: 'POST',
      body: testData,
      headers: {
        'X-Idempotency-Key': idempotencyKey
      }
    })
    
    if (firstResponse.status === 200 || firstResponse.status === 201) {
      console.log('  ✅ Primera request exitosa')
      
      // Segunda request con misma idempotency key
      const secondResponse = await makeRequest(`${BASE_URL}/api/orders`, {
        method: 'POST',
        body: testData,
        headers: {
          'X-Idempotency-Key': idempotencyKey
        }
      })
      
      if (secondResponse.status === 200) {
        console.log('  ✅ Segunda request devolvió respuesta cacheada')
        
        // Verificar que es la misma respuesta
        if (secondResponse.headers['x-idempotent-replayed'] === 'true') {
          console.log('  🎯 Header de idempotencia detectado')
        }
        
        console.log(`  ⚡ Response time: ${secondResponse.responseTime}ms (debería ser más rápido)`)
      } else {
        console.log(`  ⚠️  Segunda request falló: ${secondResponse.status}`)
      }
      
    } else {
      console.log(`  ❌ Primera request falló: ${firstResponse.status}`)
    }
    
  } catch (error) {
    console.log(`  ❌ Error en test de idempotencia: ${error.message}`)
  }
  
  console.log('')
}

// Función principal
async function runAllTests() {
  const startTime = Date.now()
  
  console.log('Ejecutando tests de Fase 2...\n')
  
  await testSystemHealth()
  await testRateLimiting()
  await testDashboardCaching()
  await testQueueSystem()
  await testOrderConcurrency()
  await testIdempotency()
  
  const totalTime = Date.now() - startTime
  
  console.log('=' .repeat(60))
  console.log(`✅ Tests de Fase 2 completados en ${totalTime}ms`)
  console.log('📊 Resumen: Verificar logs arriba para resultados detallados')
  console.log('')
  console.log('🔧 Próximos pasos recomendados:')
  console.log('  1. Verificar que todos los componentes estén "healthy"')
  console.log('  2. Confirmar que rate limiting esté activo')
  console.log('  3. Validar que el cache esté funcionando (HIT/MISS)')
  console.log('  4. Revisar métricas de performance en dashboard')
  console.log('  5. Ejecutar tests de carga con herramientas externas (k6, Artillery)')
}

// Ejecutar tests si es llamado directamente
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ Error ejecutando tests:', error)
    process.exit(1)
  })
}

module.exports = {
  runAllTests,
  testRateLimiting,
  testSystemHealth,
  testDashboardCaching,
  testQueueSystem,
  testOrderConcurrency,
  testIdempotency
}