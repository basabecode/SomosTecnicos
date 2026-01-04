// Script para verificar usuarios y tablas en la base de datos
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verificando conexión a la base de datos...\n');

  try {
    // 1. Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión exitosa a PostgreSQL\n');

    // 2. Contar registros en tablas principales
    const [customersCount, adminsCount, techniciansCount, ordersCount] = await Promise.all([
      prisma.customer.count(),
      prisma.adminUser.count(),
      prisma.technician.count(),
      prisma.order.count(),
    ]);

    console.log('📊 Resumen de Tablas:');
    console.log(`   - Customers: ${customersCount}`);
    console.log(`   - AdminUsers: ${adminsCount}`);
    console.log(`   - Technicians: ${techniciansCount}`);
    console.log(`   - Orders: ${ordersCount}\n`);

    // 3. Listar usuarios demo
    console.log('👥 Usuarios Demo:');

    const demoCustomers = await prisma.customer.findMany({
      where: { email: { contains: 'demo' } },
      select: { id: true, email: true, nombre: true, activo: true }
    });
    console.log('   Clientes:', demoCustomers.length > 0 ? demoCustomers : '❌ No hay clientes demo');

    const demoAdmins = await prisma.adminUser.findMany({
      where: { email: { contains: 'demo' } },
      select: { id: true, email: true, nombre: true, role: true, activo: true }
    });
    console.log('   Admins:', demoAdmins.length > 0 ? demoAdmins : '❌ No hay admins demo');

    const demoTechs = await prisma.technician.findMany({
      where: { email: { contains: 'demo' } },
      select: { id: true, email: true, nombre: true, activo: true }
    });
    console.log('   Técnicos:', demoTechs.length > 0 ? demoTechs : '❌ No hay técnicos demo\n');

    // 4. Listar órdenes recientes
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        nombre: true,
        estado: true,
        createdAt: true
      }
    });
    console.log('📦 Últimas 5 Órdenes:');
    if (recentOrders.length > 0) {
      recentOrders.forEach(order => {
        console.log(`   - ${order.orderNumber} | ${order.nombre} | ${order.estado} | ${order.createdAt.toISOString()}`);
      });
    } else {
      console.log('   ❌ No hay órdenes en la base de datos');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
