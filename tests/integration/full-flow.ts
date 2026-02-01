/**
 * Test de Integración: Flujo Completo
 * Simula: Cliente Solicita -> Admin Asigna -> Técnico Recibe
 * Ejecutar con: npx tsx tests/integration/full-flow.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Iniciando Simulación de Flujo Completo...\n')

  try {
    // ==========================================
    // PASO 1: PREPARACIÓN DE DATOS (User, Tech)
    // ==========================================
    console.log('1️⃣ Preparando actores...')

    // Obtener cliente demo
    const customer = await prisma.customer.findFirst({
        where: { email: 'cliente.demo@somostecnicos.com' }
    })
    if (!customer) throw new Error('Cliente demo no encontrado. Ejecuta seed-demo-users.ts')
    console.log(`   ✅ Cliente: ${customer.nombre} (ID: ${customer.id})`)

    // Obtener técnico demo
    const technician = await prisma.technician.findFirst({
      where: { email: 'tecnico.demo@somostecnicos.com' } // Asumiendo que existe en tabla Technician
    })

    // NOTA IMPORTANTISIMA:
    // Recuerda que creamos un AdminUser 'tecnico.demo' en el seed,
    // PERO tal vez no existe el Technician correspondiente en tabla Technician
    // Vamos a verificar y crearlo si hace falta para el test.

    let techId = technician?.id

    if (!technician) {
        console.log('   ⚠️ Técnico operativo no encontrado, creando mock...')
        const newTech = await prisma.technician.create({
            data: {
                nombre: 'Juan Pérez (Demo Tech)',
                email: 'tecnico.demo@somostecnicos.com', // El mismo email que el usuario
                telefono: '3999999999',
                cedula: 'DEMO-123456',
                especialidades: ['general'],
                zonaTrabajoArea: 'Zona Norte'
            }
        })
        techId = newTech.id
        console.log(`   ✅ Técnico creado: ${newTech.nombre} (ID: ${newTech.id})`)
    } else {
        console.log(`   ✅ Técnico operativo encontrado: ${technician.nombre} (ID: ${technician.id})`)
    }


    // ==========================================
    // PASO 2: CLIENTE SOLICITA SERVICIO
    // ==========================================
    console.log('\n2️⃣ Cliente solicita servicio (Simulación API POST /api/orders)...')

    const orderNumber = `ORD-TEST-${Date.now()}`
    const newOrder = await prisma.order.create({
        data: {
            orderNumber: orderNumber,
            customerId: customer.id,
            nombre: customer.nombre,
            telefono: customer.telefono,
            email: customer.email,
            direccion: customer.direccion || 'Calle Falsa 123',
            ciudad: 'Bogotá',
            tipoElectrodomestico: 'nevera',
            tipoServicio: 'reparacion',
            descripcionProblema: 'TEST DE INTEGRACION: No enfría',
            urgencia: 'alta',
            estado: 'pendiente',
            fechaPreferida: new Date()
        }
    })
    console.log(`   ✅ Orden Creada: ${newOrder.orderNumber} (Estado: ${newOrder.estado})`)


    // ==========================================
    // PASO 3: ADMIN ASIGNA TÉCNICO
    // ==========================================
    console.log('\n3️⃣ Admin asigna técnico (Simulación API POST /api/assignments)...')

    const assignment = await prisma.assignment.create({
        data: {
            orderId: newOrder.id,
            technicianId: techId!,
            estado: 'asignado',
            notasAsignacion: 'Asignación automática desde test de integración',
            fechaProgramada: new Date(Date.now() + 24 * 60 * 60 * 1000) // Mañana
        }
    })

    // Actualizar estado de orden
    await prisma.order.update({
        where: { id: newOrder.id },
        data: { estado: 'asignado' }
    })

    console.log(`   ✅ Asignación creada: ID ${assignment.id}`)
    console.log(`   ✅ Orden actualizada a estado: asignado`)


    // ==========================================
    // PASO 4: TÉCNICO CONSULTA SUS ASIGNACIONES
    // ==========================================
    console.log('\n4️⃣ Técnico consulta sus asignaciones (Validación de Lógica)...')

    // Simulamos la Query que hace el endpoint GET /api/technicians/me/assignments
    const techAssignments = await prisma.assignment.findMany({
        where: {
            technicianId: techId // Usamos el ID que encontramos/creamos en paso 1
        },
        include: {
            order: true
        }
    })

    const foundOrder = techAssignments.find(a => a.orderId === newOrder.id)

    if (foundOrder) {
        console.log(`   ✅ ÉXITO: El técnico puede ver la orden ${foundOrder.order.orderNumber}`)
        console.log(`      Detalles visualizados:`)
        console.log(`      - Cliente: ${foundOrder.order.nombre}`)
        console.log(`      - Problema: ${foundOrder.order.descripcionProblema}`)
        console.log(`      - Dirección: ${foundOrder.order.direccion}`)
    } else {
        console.error(`   ❌ FALLO: La orden no aparece en la lista del técnico.`)
        console.error(`      Debug: TechID consultado: ${techId}`)
        console.error(`      Debug: Asignaciones encontradas: ${techAssignments.length}`)
    }

    // Limpieza (opcional, para no llenar de basura, comentado para ver resultados en dashboard)
    // await prisma.assignment.delete({ where: { id: assignment.id } })
    // await prisma.order.delete({ where: { id: newOrder.id } })

  } catch (error) {
    console.error('❌ Error fatal en test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
