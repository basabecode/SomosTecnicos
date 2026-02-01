/**
 * Script para crear cuentas de prueba adicionales
 * Técnicos y clientes con credenciales simples para testing
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔑 Creando cuentas de prueba adicionales...\n')

  try {
    // =============================================
    // 1. CREAR CUENTA DE TÉCNICO DEMO
    // =============================================
    console.log('🔧 Creando cuenta de técnico demo...')

    const techEmail = 'tecnico.demo@somostecnicos.com'
    const techPassword = 'Demo2026!Secure'

    const existingTech = await prisma.adminUser.findUnique({
      where: { email: techEmail }
    })

    if (!existingTech) {
      const hashedPassword = await bcrypt.hash(techPassword, 12)

      await prisma.adminUser.create({
        data: {
          username: 'tecnico.demo',
          email: techEmail,
          passwordHash: hashedPassword,
          nombre: 'Juan',
          apellido: 'Pérez',
          role: 'technician',
          activo: true,
          preferencias: {
            tema: 'light',
            idioma: 'es',
            notificaciones: true
          }
        }
      })
      console.log(`✅ Técnico creado: ${techEmail}`)
      console.log(`   Password: ${techPassword}`)
    } else {
      console.log(`ℹ️  Técnico ya existe: ${techEmail}`)

      // Actualizar la contraseña si ya existe
      const hashedPassword = await bcrypt.hash(techPassword, 12)
      await prisma.adminUser.update({
        where: { email: techEmail },
        data: { passwordHash: hashedPassword }
      })
      console.log(`✅ Contraseña actualizada para: ${techEmail}`)
    }

    // =============================================
    // 2. VERIFICAR/ACTUALIZAR CUENTA DE CLIENTE DEMO
    // =============================================
    console.log('\n👤 Verificando cuenta de cliente demo...')

    const clientEmail = 'cliente.demo@somostecnicos.com'
    const clientPassword = 'Demo2026!Secure'

    const existingClient = await prisma.customer.findUnique({
      where: { email: clientEmail }
    })

    if (existingClient) {
      // Actualizar la contraseña
      const hashedPassword = await bcrypt.hash(clientPassword, 12)
      await prisma.customer.update({
        where: { email: clientEmail },
        data: { passwordHash: hashedPassword }
      })
      console.log(`✅ Contraseña actualizada para: ${clientEmail}`)
      console.log(`   Password: ${clientPassword}`)
    } else {
      // Crear el cliente si no existe
      const hashedPassword = await bcrypt.hash(clientPassword, 12)
      await prisma.customer.create({
        data: {
          username: 'cliente.demo',
          email: clientEmail,
          nombre: 'Camila',
          apellido: 'Suárez',
          telefono: '3005557788',
          direccion: 'Carrera 45 #12-34',
          ciudad: 'Bogotá',
          passwordHash: hashedPassword,
          preferencias: {
            tema: 'light',
            notificaciones: true,
            lenguaje: 'es'
          }
        }
      })
      console.log(`✅ Cliente creado: ${clientEmail}`)
      console.log(`   Password: ${clientPassword}`)
    }

    // =============================================
    // 3. VERIFICAR/ACTUALIZAR CUENTA DE ADMIN DEMO
    // =============================================
    console.log('\n🛡️  Verificando cuenta de admin demo...')

    const adminEmail = 'admin.demo@somostecnicos.com'
    const adminPassword = 'Demo2026!Secure'

    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      // Actualizar la contraseña
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      await prisma.adminUser.update({
        where: { email: adminEmail },
        data: { passwordHash: hashedPassword }
      })
      console.log(`✅ Contraseña actualizada para: ${adminEmail}`)
      console.log(`   Password: ${adminPassword}`)
    } else {
      // Crear el admin si no existe
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      await prisma.adminUser.create({
        data: {
          username: 'admin.demo',
          email: adminEmail,
          passwordHash: hashedPassword,
          nombre: 'Administrador',
          apellido: 'Demo',
          role: 'super_admin',
          activo: true,
          preferencias: {
            tema: 'light',
            idioma: 'es',
            notificaciones: true,
            dashboard: {
              mostrarAlertas: true,
              mostrarGraficos: true,
              ordenesPorPagina: 10
            }
          }
        }
      })
      console.log(`✅ Admin creado: ${adminEmail}`)
      console.log(`   Password: ${adminPassword}`)
    }

    console.log('\n🎉 ¡Cuentas de prueba creadas/actualizadas exitosamente!')
    console.log(`
📋 RESUMEN DE CUENTAS DE PRUEBA:

🛡️  ADMINISTRADOR:
   Email:    admin.demo@somostecnicos.com
   Password: Demo2026!Secure
   Panel:    /admin/dashboard

🔧 TÉCNICO:
   Email:    tecnico.demo@somostecnicos.com
   Password: Demo2026!Secure
   Panel:    /technician/dashboard

👤 CLIENTE:
   Email:    cliente.demo@somostecnicos.com
   Password: Demo2026!Secure
   Panel:    /customer/dashboard

⚠️  IMPORTANTE: Estas contraseñas son SOLO para testing.
    NO usar en producción.
    `)

  } catch (error) {
    console.error('❌ Error creando cuentas de prueba:', error)
    throw error
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
