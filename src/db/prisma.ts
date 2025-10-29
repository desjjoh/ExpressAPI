import { PrismaClient } from 'prisma/client';

export const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
