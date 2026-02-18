/**
 * Script de semillas para la base de datos
 * Crea datos iniciales necesarios para el funcionamiento del sistema
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando siembra de datos optimizada para producción...')

  try {

    // =============================================
    // 1. CREAR USUARIO ADMINISTRADOR POR DEFECTO
    // =============================================
    console.log('👤 Creando usuario administrador...')

    const adminEmail = 'admin@somostecnicos.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin2026!'
    const adminName = 'Administrador Sistema'

    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: {
        passwordHash: hashedPassword,
        nombre: adminName,
      },
      create: {
        username: 'admin',
        email: adminEmail,
        passwordHash: hashedPassword,
        nombre: adminName,
        role: 'super_admin',
        activo: true,
        preferencias: {
          tema: 'light',
          idioma: 'es',
          notificaciones: true,
        }
      }
    })
    console.log(`✅ Usuario administrador creado/actualizado: ${adminEmail}`)

    // =============================================
    // 3. CREAR TIPOS DE SERVICIOS
    // =============================================
    console.log('🔧 Creando tipos de servicios...')

    const serviceTypes = [
      {
        nombre: 'Reparación',
        descripcion: 'Reparación de electrodomésticos dañados',
        icono: 'wrench',
        color: '#E74C3C',
        orden: 1,
        costoBase: 50000,
        tiempoEstimado: 120,
        especialidadesRequeridas: ['nevera', 'lavadora', 'aire_acondicionado']
      },
      {
        nombre: 'Mantenimiento',
        descripcion: 'Mantenimiento preventivo y correctivo',
        icono: 'settings',
        color: '#3498DB',
        orden: 2,
        costoBase: 30000,
        tiempoEstimado: 90,
        especialidadesRequeridas: ['mantenimiento']
      },
      {
        nombre: 'Instalación',
        descripcion: 'Instalación de electrodomésticos nuevos',
        icono: 'plus-circle',
        color: '#27AE60',
        orden: 3,
        costoBase: 40000,
        tiempoEstimado: 60,
        especialidadesRequeridas: ['instalacion']
      }
    ]

    for (const serviceType of serviceTypes) {
      await prisma.serviceType.upsert({
        where: { nombre: serviceType.nombre },
        update: serviceType,
        create: serviceType
      })
      console.log(`✅ Tipo de servicio creado/actualizado: ${serviceType.nombre}`)
    }

    // =============================================
    // 4. CREAR ZONAS DE TRABAJO
    // =============================================
    console.log('📍 Creando zonas de trabajo...')

    const workZones = [
      {
        nombre: 'Zona Norte',
        descripcion: 'Usaquén, Chapinero, Chicó',
        cobertura: 'Bogotá Norte',
        costoAdicional: 0,
        tiempoAdicional: 0
      }
    ]

    for (const zone of workZones) {
      await prisma.workZone.upsert({
        where: { nombre: zone.nombre },
        update: zone,
        create: zone
      })
      console.log(`✅ Zona de trabajo creada/actualizada: ${zone.nombre}`)
    }

    // =============================================
    // 6. CREAR CONFIGURACIONES DEL SISTEMA
    // =============================================
    console.log('⚙️ Creando configuraciones del sistema...')

    const systemSettings = [
      {
        key: 'company_name',
        value: 'SomosTécnicos - Servicios Profesionales',
        descripcion: 'Nombre de la empresa',
        categoria: 'general',
        esPublico: true
      },
      {
        key: 'company_email',
        value: 'info@somostecnicos.com',
        descripcion: 'Email principal de la empresa',
        categoria: 'contact',
        esPublico: true
      }
    ]

    for (const setting of systemSettings) {
      await prisma.systemSetting.upsert({
        where: { key: setting.key },
        update: setting,
        create: setting
      })
      console.log(`✅ Configuración creada/actualizada: ${setting.key}`)
    }

    console.log('\n🎉 ¡Siembra de datos para producción completada exitosamente!')

  } catch (error) {
    console.error('❌ Error durante la siembra de datos:', error)
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
