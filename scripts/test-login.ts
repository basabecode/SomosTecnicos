/**
 * Script para probar el login con las credenciales de prueba
 */

async function testLogin() {
  const testUsers = [
    {
      email: 'admin.demo@somostecnicos.com',
      password: 'Demo2026!Secure',
      expectedRole: 'super_admin'
    },
    {
      email: 'tecnico.demo@somostecnicos.com',
      password: 'Demo2026!Secure',
      expectedRole: 'technician'
    },
    {
      email: 'cliente.demo@somostecnicos.com',
      password: 'Demo2026!Secure',
      expectedRole: 'customer'
    }
  ]

  console.log('🧪 Iniciando pruebas de login...\n')

  for (const user of testUsers) {
    try {
      console.log(`🔑 Probando login: ${user.email}`)

      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        console.log(`✅ Login exitoso para ${user.email}`)
        console.log(`   👤 Usuario: ${data.user.nombre} ${data.user.apellido || ''}`)
        console.log(`   🔒 Role: ${data.user.role}`)
        console.log(`   🎯 Role esperado: ${user.expectedRole}`)
        console.log(`   🟢 Roles coinciden: ${data.user.role === user.expectedRole ? 'Sí' : 'No'}`)
        console.log(`   🔑 Token generado: ${data.accessToken ? 'Sí' : 'No'}`)
      } else {
        console.log(`❌ Login falló para ${user.email}`)
        console.log(`   Error: ${data.error}`)
        console.log(`   Status: ${response.status}`)
      }

      console.log('')

    } catch (error) {
      console.log(`❌ Error de conexión para ${user.email}:`, error instanceof Error ? error.message : 'Error desconocido')
      console.log('')
    }
  }
}

// Nota: Este script requiere que el servidor esté corriendo en localhost:3000
console.log('📋 Asegúrate de que el servidor esté corriendo con: npm run dev')
console.log('🌐 URL esperada: http://localhost:3000\n')

testLogin()
