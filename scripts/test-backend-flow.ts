
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Iniciando prueba de flujo transaccional (Backend Simulation)...\n')

  try {
    // 1. Crear nuevo cliente
    const uniqueId = Date.now().toString()
    const email = `test.user.${uniqueId}@example.com`
    const password = 'TestPassword123!'
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log(`1. Creando cliente: ${email}`)
    const customer = await prisma.customer.create({
      data: {
        username: `user_${uniqueId}`,
        email: email,
        passwordHash: hashedPassword,
        nombre: 'Test User',
        telefono: '555-0199',
        activo: true
      }
    })
    console.log(`   ✅ Cliente creado con ID: ${customer.id}`)

    // 2. Crear Orden
    const orderNumber = `ORD-${uniqueId}`
    console.log(`2. Creando orden de servicio: ${orderNumber}`)
    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber,
        customerId: customer.id,
        nombre: customer.nombre,
        telefono: customer.telefono,
        email: customer.email,
        direccion: 'Calle Falsa 123',
        ciudad: 'Bogotá',
        tipoElectrodomestico: 'lavadora',
        tipoServicio: 'reparacion',
        descripcionProblema: 'Prueba de flujo backend',
        urgencia: 'media',
        estado: 'pendiente'
      }
    })
    console.log(`   ✅ Orden creada con ID: ${order.id}`)

    // 3. Crear Historial (Trigger manual si no hay triggers en DB)
    await prisma.orderHistory.create({
      data: {
        orderId: order.id,
        estadoNuevo: 'pendiente',
        changedBy: 'system',
        notas: 'Orden creada por script de prueba'
      }
    })
    console.log('   ✅ Historial de orden inicializado')

    // 4. Asignar Técnico (Simular Admin o Sistema)
    const technician = await prisma.technician.findFirst()
    if (!technician) throw new Error('No technicians available!')

    console.log(`3. Asignando orden al técnico: ${technician.nombre}`)
    const assignment = await prisma.assignment.create({
      data: {
        orderId: order.id,
        technicianId: technician.id,
        estado: 'asignado',
        notasAsignacion: 'Asignación automática de prueba'
      }
    })

    // Actualizar estado de orden
    await prisma.order.update({
      where: { id: order.id },
      data: { estado: 'asignado' }
    })
     console.log(`   ✅ Asignación creada con ID: ${assignment.id}`)


    console.log('\n✅ FLUJO TRANSACCIONAL COMPLETADO EXITOSAMENTE.')
    console.log('El backend es capaz de registrar usuarios, crear órdenes y procesar asignaciones.')

  } catch (error) {
    console.error('❌ Error en el flujo transaccional:', error)
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
