
import { prisma } from '../lib/prisma'
import { ORDER_STATES, USER_ROLES } from '../lib/constants'

async function main() {
  console.log('🚀 Iniciando prueba de ciclo de vida de servicio...')

  const uniqueId = Date.now().toString()
  const customerEmail = `cust-${uniqueId}@test.com`
  const technicianEmail = `tech-${uniqueId}@test.com`
  const techPhone = `3${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`
  const userPhone = `3${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`

  // 1. Crear Usuario Cliente y Técnico para la prueba
  console.log('1. Creando usuarios de prueba...')

  const customer = await prisma.customer.create({
    data: {
      username: `cust_${uniqueId}`,
      email: customerEmail,
      nombre: 'Cliente Prueba',
      telefono: userPhone,
      passwordHash: 'hash_test',
      activo: true
    }
  })

  // Crear usuario admin para el técnico (auth)
  await prisma.adminUser.create({
    data: {
      username: `tech_${uniqueId}`,
      email: technicianEmail,
      passwordHash: 'hash_test',
      nombre: 'Técnico Prueba',
      role: USER_ROLES.TECHNICIAN || 'technician',
      activo: true
    }
  })

  // Crear perfil técnico (data)
  const technician = await prisma.technician.create({
    data: {
      email: technicianEmail,
      nombre: 'Técnico Prueba',
      telefono: techPhone,
      cedula: uniqueId,
      activo: true,
      especialidades: ['Lavadoras'],
      disponible: true
    }
  })

  // 2. Crear Orden (Estado Pendiente)
  console.log('2. Creando orden de servicio...')
  const order = await prisma.order.create({
    data: {
      orderNumber: `TEST-${uniqueId.slice(-4)}`,
      customerId: customer.id,
      nombre: customer.nombre,
      telefono: customer.telefono,
      email: customer.email,
      direccion: 'Calle Falsa 123',
      ciudad: 'Bogotá',
      tipoElectrodomestico: 'Lavadora',
      tipoServicio: 'Reparación',
      descripcionProblema: 'No centrifuga',
      urgencia: 'media',
      estado: ORDER_STATES.PENDIENTE
    }
  })
  console.log(`Orden creada: ${order.orderNumber} (ID: ${order.id})`)

  // 3. Asignar Técnico
  console.log('3. Asignando técnico...')
  const assignment = await prisma.assignment.create({
    data: {
      orderId: order.id,
      technicianId: technician.id,
      estado: 'asignado',
      fechaAsignacion: new Date()
    }
  })

  await prisma.order.update({
    where: { id: order.id },
    data: { estado: ORDER_STATES.ASIGNADO }
  })
  console.log('Técnico asignado.')

  // 4. Simular Flujo: Técnico Cotiza
  console.log('4. [Técnico] Enviando cotización...')

  const cotizacionMonto = 150000
  const diagnostico = 'Falla en motor bomba'

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        estado: ORDER_STATES.COTIZADO,
        costoEstimado: cotizacionMonto,
        descripcionProblema: diagnostico
      }
    })

    await tx.orderHistory.create({
      data: {
        orderId: order.id,
        estadoAnterior: ORDER_STATES.ASIGNADO,
        estadoNuevo: ORDER_STATES.COTIZADO,
        changedBy: 'technician',
        changedById: technician.id.toString(),
        notas: `Cotización: ${cotizacionMonto}`
      }
    })
  })
  console.log('Cotización registrada.')

  // 5. Simular Flujo: Cliente Aprueba
  console.log('5. [Cliente] Aprobando cotización...')

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        estado: ORDER_STATES.EN_PROCESO
      }
    })

    await tx.orderHistory.create({
      data: {
        orderId: order.id,
        estadoAnterior: ORDER_STATES.COTIZADO,
        estadoNuevo: ORDER_STATES.EN_PROCESO,
        changedBy: 'customer',
        changedById: customer.id.toString(),
        notas: 'Cliente aprobó'
      }
    })
  })
  console.log('Orden aprobada y en proceso.')

  // 6. Simular Flujo: Técnico Cierra (Reparado)
  console.log('6. [Técnico] Cerrando servicio como REPARADO...')

  const costoFinal = 150000
  const descripcionCierre = 'Se cambió la bomba y funcionó'

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        estado: 'reparado', // O ORDER_STATES.REPARADO
        costoFinal: costoFinal,
        fechaCompletado: new Date()
      }
    })

    await tx.assignment.update({
      where: { id: assignment.id },
      data: {
        estado: 'completado',
        fechaCompletada: new Date(),
        notasTecnico: descripcionCierre
      }
    })

    await tx.orderHistory.create({
      data: {
        orderId: order.id,
        estadoAnterior: ORDER_STATES.EN_PROCESO,
        estadoNuevo: 'reparado',
        changedBy: 'technician',
        changedById: technician.id.toString(),
        notas: 'Reparación exitosa'
      }
    })
  })

  // Verificación final
  const finalOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: { history: true } // Corregido: history, no orderHistory
  })

  console.log('\n=== RESUMEN FINAL DE LA ORDEN ===')
  console.log(`Estado: ${finalOrder?.estado}`)
  console.log(`Costo Final: ${finalOrder?.costoFinal}`)
  console.log('Historial:')
  finalOrder?.history.forEach(h => {
    console.log(`- ${h.estadoAnterior} -> ${h.estadoNuevo} (${h.changedBy}): ${h.notas}`)
  })

  console.log('\n✅ Prueba de ciclo de vida completada con éxito.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
