
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Iniciando pruebas de verificación de backend y base de datos...\n')
  let passed = true

  // 1. Verificar Conexión
  try {
    await prisma.$connect()
    console.log('✅ Conexión a la base de datos establecida exitosamente.')
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error)
    process.exit(1)
  }

  // 2. Verificar Admin User
  const admin = await prisma.adminUser.findFirst({
    where: { email: 'admin.demo@somostecnicos.com' }
  })
  if (admin) {
    console.log(`✅ Usuario Administrador encontrado: ${admin.email}`)
  } else {
    console.error('❌ No se encontró el usuario administrador principal.')
    passed = false
  }

  // 3. Verificar Service Types
  const serviceTypesCount = await prisma.serviceType.count()
  if (serviceTypesCount > 0) {
    console.log(`✅ Tipos de Servicio encontrados: ${serviceTypesCount}`)
  } else {
    console.warn('⚠️ No se encontraron Tipos de Servicio.')
    passed = false
  }

  // 4. Verificar Técnicos
  const techniciansCount = await prisma.technician.count()
  if (techniciansCount > 0) {
    console.log(`✅ Técnicos encontrados: ${techniciansCount}`)
  } else {
    console.warn('⚠️ No se encontraron técnicos registrados.')
    passed = false
  }

  // 5. Verificar Clientes
  const customersCount = await prisma.customer.count()
  if (customersCount > 0) {
    console.log(`✅ Clientes encontrados: ${customersCount}`)
  } else {
    console.warn('⚠️ No se encontraron clientes registrados.')
  }

  // 6. Verificar Órdenes
  const ordersCount = await prisma.order.count()
  if (ordersCount > 0) {
    console.log(`✅ Órdenes encontradas: ${ordersCount}`)
  } else {
    console.warn('⚠️ No se encontraron órdenes registradas.')
  }

    // 7. Verificar Settings
  const settingsCount = await prisma.systemSetting.count()
  if (settingsCount > 0) {
    console.log(`✅ Configuraciones del sistema encontradas: ${settingsCount}`)
  } else {
    console.warn('⚠️ No se encontraron configuraciones del sistema.')
  }

  console.log('\n----------------------------------------')
  if (passed) {
    console.log('🎉 PRUEBAS DE BACKEND Y BASE DE DATOS COMPLETADAS CON ÉXITO.')
    console.log('El sistema parece estar correctamente configurado y alimentado.')
  } else {
    console.error('⚠️ ALGUNAS PRUEBAS FALLARON O FALTAN DATOS.')
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
