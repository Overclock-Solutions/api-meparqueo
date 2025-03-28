import { PrismaClient, Role, GlobalStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.warn('🗑️  Limpiando base de datos...');
  await prisma.parkingLotHistory.deleteMany({});
  await prisma.parkingLot.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.person.deleteMany({});
  await prisma.node.deleteMany({});

  console.warn('👤 Creando usuarios...');

  const personAdmin = await prisma.person.create({
    data: {
      names: 'Jose',
      lastNames: 'Gaspar',
      phone: '3116347712',
      email: 'jgasparlopez29@gmail.com',
    },
  });

  await prisma.user.create({
    data: {
      email: 'jgasparlopez29@gmail.com',
      password: '$2b$10$gmE6tgLtclSq7LcI.bxB9uLU33Yy1h2LYPD41pNaPEUT740Qvr7C6',
      role: Role.ADMIN,
      globalStatus: GlobalStatus.ACTIVE,
      person: { connect: { id: personAdmin.id } },
    },
  });

  console.warn(`✅ Usuarios creados`);

  console.warn('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.warn('📡 Conexión cerrada');
  });
