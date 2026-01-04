// Script para crear usuarios demo para testing
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creando usuarios demo para testing...\n');

  try {
    // Password hash para "123456"
    const passwordHash = await bcrypt.hash('123456', 10);

    // 1. Crear Admin Demo
    const admin = await prisma.adminUser.upsert({
      where: { email: 'admin.demo@tecnocity.com' },
      update: {},
      create: {
        username: 'admin_demo',
        email: 'admin.demo@tecnocity.com',
        passwordHash: passwordHash,
        nombre: 'Admin',
        apellido: 'Demo',
        telefono: '3001234567',
        role: 'admin',
        activo: true
      }
    });
    console.log('✅ Admin creado:', admin.email);

    // 2. Crear Técnico Demo
    const technician = await prisma.technician.upsert({
      where: { email: 'tecnico.demo@tecnocity.com' },
      update: {},
      create: {
        nombre: 'Juan Pérez',
        telefono: '3007654321',
        email: 'tecnico.demo@tecnocity.com',
        cedula: '1234567890',
        especialidades: ['lavadora', 'nevera', 'general'],
        zonaTrabajoArea: 'Bogotá',
        activo: true,
        disponible: true
      }
    });
    console.log('✅ Técnico creado:', technician.email);

    // 3. Verificar Cliente Demo (ya existe)
    const customer = await prisma.customer.findUnique({
      where: { email: 'cliente.demo@tecnocity.com' }
    });
    console.log('✅ Cliente verificado:', customer?.email || 'NO ENCONTRADO');

    console.log('\n🎉 Usuarios demo listos para testing!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
