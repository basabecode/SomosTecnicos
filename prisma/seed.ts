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

    const adminEmail = 'admin.demo@somostecnicos.com'
    const adminPassword = 'Demo2026!Secure'
    const adminName = 'Administrador Demo'

    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: {
        passwordHash: hashedPassword,
        nombre: adminName,
      },
      create: {
        username: 'admin_demo',
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
    // 2. CREAR CLIENTES DE PRUEBA
    // =============================================
    console.log('👥 Creando clientes de prueba...')

    const customersData = [
      {
        username: 'cliente_demo',
        email: 'cliente.demo@somostecnicos.com',
        nombre: 'Camila',
        apellido: 'Suárez',
        telefono: '3005557788',
        direccion: 'Carrera 45 #12-34',
        ciudad: 'Bogotá',
        password: 'Demo2026!Secure'
      }
    ]

    const seededCustomers: any[] = []

    for (const customer of customersData) {
      const hashedPassword = await bcrypt.hash(customer.password, 12)
      const created = await prisma.customer.upsert({
        where: { email: customer.email },
        update: {
          passwordHash: hashedPassword,
          nombre: customer.nombre,
          apellido: customer.apellido,
        },
        create: {
          username: customer.username,
          email: customer.email,
          nombre: customer.nombre,
          apellido: customer.apellido,
          telefono: customer.telefono,
          direccion: customer.direccion,
          ciudad: customer.ciudad,
          passwordHash: hashedPassword,
          preferencias: {
            tema: 'light',
            notificaciones: true,
          }
        }
      })
      console.log(`✅ Cliente creado/actualizado: ${customer.email}`)
      seededCustomers.push(created)
    }

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
    // 5. CREAR TÉCNICOS DE EJEMPLO
    // =============================================
    console.log('👷 Creando técnicos de ejemplo...')

    const techPassword = await bcrypt.hash('Demo2026!Secure', 12)

    const technician = {
      nombre: 'Carlos Mendoza',
      telefono: '3151234567',
      email: 'tecnico.demo@somostecnicos.com',
      cedula: '12345678',
      especialidades: ['nevera', 'congelador', 'aire_acondicionado'],
      zonaTrabajoArea: 'Zona Norte',
      activo: true,
      disponible: true,
    }

    const createdTech = await prisma.technician.upsert({
      where: { email: technician.email },
      update: technician,
      create: technician
    })
    console.log(`✅ Técnico creado/actualizado: ${technician.nombre}`)

    // Crear cuenta de login para el técnico
    await prisma.adminUser.upsert({
      where: { email: technician.email },
      update: {
        passwordHash: techPassword,
        nombre: technician.nombre,
      },
      create: {
        username: 'tecnico_demo',
        email: technician.email,
        passwordHash: techPassword,
        nombre: technician.nombre,
        role: 'technician',
        activo: true
      }
    })

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

    // =============================================
    // 7. CREAR ÓRDENES DE PRUEBA
    // =============================================
    console.log('🧾 Creando órdenes de prueba...')

    const customer = seededCustomers[0]

    const orders = [
      {
        orderNumber: 'DEMO-001',
        tipoElectrodomestico: 'lavadora',
        tipoServicio: 'Reparación',
        descripcionProblema: 'Reparación de lavadora - Demo',
        urgencia: 'media',
        estado: 'completado',
        fechaCompletado: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        orderNumber: 'DEMO-002',
        tipoElectrodomestico: 'aire_acondicionado',
        tipoServicio: 'Instalación',
        descripcionProblema: 'Instalación de aire acondicionado - Demo',
        urgencia: 'baja',
        estado: 'pendiente'
      }
    ]

    for (const order of orders) {
      const createdOrder = await prisma.order.upsert({
        where: { orderNumber: order.orderNumber },
        update: {
          ...order,
          customerId: customer.id,
          nombre: `${customer.nombre} ${customer.apellido ?? ''}`.trim(),
          telefono: customer.telefono,
          email: customer.email,
          direccion: customer.direccion ?? 'Bogotá',
          ciudad: customer.ciudad ?? 'Bogotá',
        },
        create: {
          ...order,
          customerId: customer.id,
          nombre: `${customer.nombre} ${customer.apellido ?? ''}`.trim(),
          telefono: customer.telefono,
          email: customer.email,
          direccion: customer.direccion ?? 'Bogotá',
          ciudad: customer.ciudad ?? 'Bogotá',
        }
      })

      await prisma.orderHistory.create({
        data: {
          orderId: createdOrder.id,
          estadoNuevo: order.estado,
          changedBy: 'system',
          notas: 'Orden demo creada para producción'
        }
      })
      console.log(`✅ Orden creada/actualizada: ${order.orderNumber}`)
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
