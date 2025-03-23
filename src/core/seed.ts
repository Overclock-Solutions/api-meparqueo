import {
  PrismaClient,
  Role,
  ParkingLotStatus,
  ParkingLotAvailability,
  GlobalStatus,
  Version,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.warn('🗑️  Limpiando base de datos...');
  await prisma.parkingLotHistory.deleteMany({});
  await prisma.parkingLot.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.person.deleteMany({});
  await prisma.node.deleteMany({});

  console.warn('👤 Creando usuarios...');

  const owner = await prisma.person.create({
    data: {
      names: 'Jhon',
      lastNames: 'Doe',
      phone: '3110000000',
      email: 'jhondoe@miparqueo.com',
    },
  });

  const personAdmin = await prisma.person.create({
    data: {
      names: 'Admin',
      lastNames: 'Admin',
      phone: '3110000001',
      email: 'admin@miparqueo.com',
    },
  });

  await prisma.user.create({
    data: {
      email: 'jhondoe@miparqueo.com',
      password: '$2b$10$83WHVDqFmdfcR0f3MyhfruXJusUJcHjGNGy0hlbtJrwnAi1yCmzwK',
      role: Role.OWNER,
      globalStatus: GlobalStatus.ACTIVE,
      person: {
        connect: { id: owner.id },
      },
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@miparqueo.com',
      password: '$2b$10$83WHVDqFmdfcR0f3MyhfruXJusUJcHjGNGy0hlbtJrwnAi1yCmzwK',
      role: Role.ADMIN,
      globalStatus: GlobalStatus.ACTIVE,
      person: {
        connect: { id: personAdmin.id },
      },
    },
  });
  console.warn(`✅ Usuarios creados`);

  console.warn('🔧 Creando nodos...');
  const node1 = await prisma.node.create({
    data: {
      code: 'ND001',
      version: Version.BETA,
      globalStatus: GlobalStatus.ACTIVE,
    },
  });
  console.warn('✅ Nodos creados');

  console.warn('🅿️  Creando parqueaderos...');
  await prisma.parkingLot.create({
    data: {
      code: 'P001',
      name: 'Parqueadero',
      address: 'Calle 27 &, Av. 1, Montería',
      latitude: 8.7554462,
      longitude: -75.8889753,
      status: ParkingLotStatus.OPEN,
      availability: ParkingLotAvailability.MORE_THAN_FIVE,
      globalStatus: GlobalStatus.ACTIVE,
      owner: {
        connect: { id: admin.id },
      },
      nodes: {
        connect: { id: node1.id },
      },
    },
  });
  console.warn('✅ Parqueaderos creados');

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
