import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const admins = await prisma.adminUser.findMany({ select: { email: true, role: true, activo: true } });
  const customers = await prisma.customer.findMany({ select: { email: true, activo: true } });

  console.log('--- ADMINS ---');
  console.table(admins);

  console.log('--- CUSTOMERS ---');
  console.table(customers);
}
main().catch(console.error).finally(() => prisma.$disconnect());
