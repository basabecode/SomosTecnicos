/**
 * Script de semillas para la base de datos
 * Crea datos iniciales necesarios para el funcionamiento del sistema
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando siembra de datos...')

  try {
    // =============================================
    // 1. CREAR USUARIO ADMINISTRADOR POR DEFECTO
    // =============================================
    console.log('👤 Creando usuario administrador...')

    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin.demo@tecnocity.com'
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || '123456'
    const adminName = process.env.DEFAULT_ADMIN_NAME || 'Administrador Principal'

    // Verificar si ya existe el admin
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: adminEmail }
    })

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12)

      await prisma.adminUser.create({
        data: {
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
            dashboard: {
              mostrarAlertas: true,
              mostrarGraficos: true,
              ordenesPorPagina: 10
            }
          }
        }
      })
      console.log(`✅ Usuario administrador creado: ${adminEmail}`)
    } else {
      console.log('ℹ️ Usuario administrador ya existe')
    }

    // =============================================
    // 1.1 CREAR CLIENTES DE PRUEBA
    // =============================================
    console.log('👥 Creando clientes de prueba...')

    const customersData = [
      {
        username: 'cliente.demo',
        email: 'cliente.demo@tecnocity.com',
        nombre: 'Camila',
        apellido: 'Suárez',
        telefono: '3005557788',
        direccion: 'Carrera 45 #12-34',
        ciudad: 'Bogotá',
        password: '123456'
      },
      {
        username: 'cliente.vip',
        email: 'cliente.vip@tecnocity.com',
        nombre: 'Esteban',
        apellido: 'Mejía',
        telefono: '3106668899',
        direccion: 'Calle 98 #23-45',
        ciudad: 'Medellín',
        password: '123456'
      },
      {
        username: 'cliente.norte',
        email: 'cliente.norte@tecnocity.com',
        nombre: 'Daniela',
        apellido: 'Gómez',
        telefono: '3207779900',
        direccion: 'Transversal 25 #45-12',
        ciudad: 'Barranquilla',
        password: '123456'
      }
    ]

    const seededCustomers: Array<{
      id: number
      username: string
      email: string
      nombre: string
      apellido?: string | null
      telefono: string
      direccion?: string | null
      ciudad?: string | null
    }> = []

    for (const customer of customersData) {
      // Verificar si ya existe por email O username
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          OR: [
            { email: customer.email },
            { username: customer.username }
          ]
        }
      })

      if (!existingCustomer) {
        const hashedPassword = await bcrypt.hash(customer.password, 12)
        const created = await prisma.customer.create({
          data: {
            username: customer.username,
            email: customer.email,
            nombre: customer.nombre,
            apellido: customer.apellido || null,
            telefono: customer.telefono,
            direccion: customer.direccion || null,
            ciudad: customer.ciudad || null,
            passwordHash: hashedPassword,
            preferencias: {
              tema: 'light',
              notificaciones: true,
              lenguaje: 'es'
            }
          }
        })
        console.log(`✅ Cliente creado: ${customer.email}`)
        seededCustomers.push({
          id: created.id,
          username: created.username,
          email: created.email,
          nombre: created.nombre,
          apellido: created.apellido ?? undefined,
          telefono: created.telefono,
          direccion: created.direccion ?? undefined,
          ciudad: created.ciudad ?? undefined
        })
      } else {
        console.log(`ℹ️ Cliente ya existe: ${customer.email} (username: ${customer.username})`)
        seededCustomers.push({
          id: existingCustomer.id,
          username: existingCustomer.username,
          email: existingCustomer.email,
          nombre: existingCustomer.nombre,
          apellido: existingCustomer.apellido ?? undefined,
          telefono: existingCustomer.telefono,
          direccion: existingCustomer.direccion ?? undefined,
          ciudad: existingCustomer.ciudad ?? undefined
        })
      }
    }

    // =============================================
    // 2. CREAR TIPOS DE SERVICIOS
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
        especialidadesRequeridas: ['general', 'reparacion']
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
        especialidadesRequeridas: ['instalacion', 'general']
      },
      {
        nombre: 'Diagnóstico',
        descripcion: 'Diagnóstico de problemas y cotización',
        icono: 'search',
        color: '#F39C12',
        orden: 4,
        costoBase: 20000,
        tiempoEstimado: 45,
        especialidadesRequeridas: ['diagnostico', 'general']
      },
      {
        nombre: 'Limpieza Profunda',
        descripcion: 'Limpieza profunda y mantenimiento estético',
        icono: 'droplets',
        color: '#9B59B6',
        orden: 5,
        costoBase: 25000,
        tiempoEstimado: 90,
        especialidadesRequeridas: ['limpieza', 'mantenimiento']
      }
    ]

    for (const serviceType of serviceTypes) {
      const existing = await prisma.serviceType.findUnique({
        where: { nombre: serviceType.nombre }
      })

      if (!existing) {
        await prisma.serviceType.create({
          data: serviceType
        })
        console.log(`✅ Tipo de servicio creado: ${serviceType.nombre}`)
      }
    }

    // =============================================
    // 3. CREAR ZONAS DE TRABAJO
    // =============================================
    console.log('📍 Creando zonas de trabajo...')

    const workZones = [
      {
        nombre: 'Zona Norte',
        descripcion: 'Usaquén, Chapinero, Zona Rosa',
        cobertura: 'Usaquén, Chapinero, Zona Rosa, Chicó',
        costoAdicional: 0,
        tiempoAdicional: 0
      },
      {
        nombre: 'Zona Centro',
        descripcion: 'Centro, La Candelaria, Teusaquillo',
        cobertura: 'Centro, La Candelaria, Teusaquillo, Zona T',
        costoAdicional: 0,
        tiempoAdicional: 15
      },
      {
        nombre: 'Zona Sur',
        descripcion: 'Kennedy, Tunjuelito, Ciudad Bolívar',
        cobertura: 'Kennedy, Tunjuelito, Ciudad Bolívar, Bosa',
        costoAdicional: 5000,
        tiempoAdicional: 30
      },
      {
        nombre: 'Zona Oeste',
        descripcion: 'Fontibón, Engativá, Suba',
        cobertura: 'Fontibón, Engativá, Suba, Cota',
        costoAdicional: 3000,
        tiempoAdicional: 20
      },
      {
        nombre: 'Zona Este',
        descripcion: 'San Cristóbal, Rafael Uribe, Puente Aranda',
        cobertura: 'San Cristóbal, Rafael Uribe, Puente Aranda',
        costoAdicional: 4000,
        tiempoAdicional: 25
      }
    ]

    for (const zone of workZones) {
      const existing = await prisma.workZone.findUnique({
        where: { nombre: zone.nombre }
      })

      if (!existing) {
        await prisma.workZone.create({
          data: zone
        })
        console.log(`✅ Zona de trabajo creada: ${zone.nombre}`)
      }
    }

    // =============================================
    // 4. CREAR TÉCNICOS DE EJEMPLO
    // =============================================
    console.log('👷 Creando técnicos de ejemplo...')

    const technicians = [
      {
        nombre: 'Carlos Mendoza',
        telefono: '3151234567',
        email: 'tecnico.demo@tecnocity.com', // Updated alias for login demo
        cedula: '12345678',
        especialidades: ['nevera', 'congelador', 'aire_acondicionado'],
        zonaTrabajoArea: 'Zona Norte',
        ordenesCompletadas: 45,
        calificacionPromedio: 4.9,
        // Optional: Adding password for AdminUser creation
        loginAccess: true
      },
      {
        nombre: 'María Rodriguez',
        telefono: '3207654321',
        email: 'maria.rodriguez@servicio.com',
        cedula: '87654321',
        especialidades: ['lavadora', 'secadora', 'lavavajillas'],
        zonaTrabajoArea: 'Zona Centro',
        ordenesCompletadas: 38,
        calificacionPromedio: 4.8
      },
      {
        nombre: 'Luis Hernández',
        telefono: '3009876543',
        email: 'luis.hernandez@servicio.com',
        cedula: '11223344',
        especialidades: ['estufa', 'horno', 'microondas'],
        zonaTrabajoArea: 'Zona Sur',
        ordenesCompletadas: 29,
        calificacionPromedio: 4.2
      },
      {
        nombre: 'Ana Suárez',
        telefono: '3145556666',
        email: 'ana.suarez@servicio.com',
        cedula: '55667788',
        especialidades: ['general', 'mantenimiento', 'limpieza'],
        zonaTrabajoArea: 'Zona Oeste',
        ordenesCompletadas: 35,
        calificacionPromedio: 4.6
      },
      {
        nombre: 'Pedro López',
        telefono: '3178889999',
        email: 'pedro.lopez@servicio.com',
        cedula: '99887766',
        especialidades: ['nevera', 'lavadora', 'general'],
        zonaTrabajoArea: 'Zona Este',
        ordenesCompletadas: 31,
        calificacionPromedio: 4.4
      }
    ]

    for (const tech of technicians) {
      // 1. Create Technician Profile
      const existing = await prisma.technician.findUnique({
        where: { email: tech.email }
      })

      if (!existing) {
        const { loginAccess, ...techData } = tech;
        await prisma.technician.create({
          data: techData
        })
        console.log(`✅ Técnico creado: ${tech.nombre}`)
      }

      // 2. Create Login Account (AdminUser) if needed for this technician
      // We only strictly need it for the demo technician
      if (tech.loginAccess) {
         const existingAdminTech = await prisma.adminUser.findUnique({
            where: { email: tech.email }
         })

         if (!existingAdminTech) {
            const techPassword = await bcrypt.hash('123456', 12);
            await prisma.adminUser.create({
                data: {
                    username: tech.email.split('@')[0],
                    email: tech.email,
                    passwordHash: techPassword,
                    nombre: tech.nombre,
                    role: 'technician',
                    activo: true
                }
            })
            console.log(`✅ Cuenta de login creada para técnico: ${tech.email}`)
         }
      }
    }

    // =============================================
    // 5. CREAR CONFIGURACIONES DEL SISTEMA
    // =============================================
    console.log('⚙️ Creando configuraciones del sistema...')

    const systemSettings = [
      {
        key: 'company_name',
        value: 'Servicio Técnico Profesional',
        descripcion: 'Nombre de la empresa',
        categoria: 'general',
        esPublico: true
      },
      {
        key: 'company_phone',
        value: '+57 310 123 4567',
        descripcion: 'Teléfono principal de la empresa',
        categoria: 'contact',
        esPublico: true
      },
      {
        key: 'company_email',
        value: 'info@servicio-tecnico.com',
        descripcion: 'Email principal de la empresa',
        categoria: 'contact',
        esPublico: true
      },
      {
        key: 'max_orders_per_technician',
        value: '5',
        descripcion: 'Máximo número de órdenes activas por técnico',
        tipo: 'number',
        categoria: 'system'
      },
      {
        key: 'auto_assign_orders',
        value: 'false',
        descripcion: 'Asignación automática de órdenes a técnicos',
        tipo: 'boolean',
        categoria: 'system'
      },
      {
        key: 'notification_email_enabled',
        value: 'true',
        descripcion: 'Habilitar notificaciones por email',
        tipo: 'boolean',
        categoria: 'notifications'
      },
      {
        key: 'notification_sms_enabled',
        value: 'false',
        descripcion: 'Habilitar notificaciones por SMS',
        tipo: 'boolean',
        categoria: 'notifications'
      },
      {
        key: 'business_hours',
        value: '{"start": "08:00", "end": "18:00", "timezone": "America/Bogota"}',
        descripcion: 'Horarios de atención',
        tipo: 'json',
        categoria: 'general',
        esPublico: true
      }
    ]

    for (const setting of systemSettings) {
      const existing = await prisma.systemSetting.findUnique({
        where: { key: setting.key }
      })

      if (!existing) {
        await prisma.systemSetting.create({
          data: setting
        })
        console.log(`✅ Configuración creada: ${setting.key}`)
      }
    }

    // =============================================
    // 6. CREAR ÓRDENES DE PRUEBA PARA CLIENTES
    // =============================================
    console.log('🧾 Creando órdenes de prueba para clientes...')

    const customerOrders = [
      {
        email: 'cliente.demo@somostecnicos.com',
        orderNumber: 'ORD-CL-1001',
        tipoElectrodomestico: 'lavadora',
        tipoServicio: 'reparacion',
        descripcionProblema: 'Lavadora no centrifuga y genera ruido metálico',
        urgencia: 'alta',
        estado: 'en_proceso',
        fechaPreferida: new Date(Date.now() + 2 * 60 * 60 * 1000),
        horario: 'mañana'
      },
      {
        email: 'cliente.demo@somostecnicos.com',
        orderNumber: 'ORD-CL-1002',
        tipoElectrodomestico: 'nevera',
        tipoServicio: 'mantenimiento',
        descripcionProblema: 'Mantenimiento preventivo programado',
        urgencia: 'media',
        estado: 'pendiente',
        fechaPreferida: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        horario: 'tarde'
      },
      {
        email: 'cliente.vip@somostecnicos.com',
        orderNumber: 'ORD-CL-2001',
        tipoElectrodomestico: 'microondas',
        tipoServicio: 'diagnostico',
        descripcionProblema: 'No calienta los alimentos de forma uniforme',
        urgencia: 'baja',
        estado: 'completado',
        fechaPreferida: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        horario: 'mañana'
      }
    ]

    for (const order of customerOrders) {
      const customer = seededCustomers.find(c => c.email === order.email)

      if (!customer) continue

      const existingOrder = await prisma.order.findUnique({
        where: { orderNumber: order.orderNumber }
      })

      if (existingOrder) {
        console.log(`ℹ️ Orden ya existe: ${order.orderNumber}`)
        continue
      }

      const newOrder = await prisma.order.create({
        data: {
          orderNumber: order.orderNumber,
          customerId: customer.id,
          nombre: `${customer.nombre} ${customer.apellido ?? ''}`.trim(),
          telefono: customer.telefono,
          email: customer.email,
          direccion: customer.direccion ?? 'Dirección no registrada',
          ciudad: customer.ciudad ?? 'Bogotá',
          tipoElectrodomestico: order.tipoElectrodomestico,
          tipoServicio: order.tipoServicio,
          descripcionProblema: order.descripcionProblema,
          urgencia: order.urgencia,
          fechaPreferida: order.fechaPreferida,
          horario: order.horario,
          estado: order.estado
        }
      })

      await prisma.orderHistory.create({
        data: {
          orderId: newOrder.id,
          estadoNuevo: order.estado,
          changedBy: 'system',
          notas: 'Orden creada automáticamente para cliente de prueba'
        }
      })

      console.log(`✅ Orden creada: ${order.orderNumber}`)
    }

    console.log('\n🎉 ¡Siembra de datos completada exitosamente!')
    console.log(`
📋 Resumen de datos creados:
- ✅ Usuario administrador: ${adminEmail}
- ✅ Tipos de servicios: 5
- ✅ Zonas de trabajo: 5
- ✅ Técnicos: 5
- ✅ Configuraciones: ${systemSettings.length}
- ✅ Clientes de prueba: ${seededCustomers.length}
- ✅ Órdenes clientes: ${customerOrders.length}

🔑 Credenciales de administrador:
Email: ${adminEmail}
Password: ${adminPassword}

⚠️  ¡IMPORTANTE! Cambia la contraseña del administrador en producción.
    `)

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
