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

  const person = await prisma.person.create({
    data: {
      names: 'Andres Felipe',
      lastNames: 'Suarez Gonzalez',
      email: 'anfesugo22@gmail.com',
      phone: '3012345678',
    },
  });
  console.warn(`✅ Persona creada`);

  await prisma.user.create({
    data: {
      email: 'anfesugo22@gmail.com',
      password: '$2b$10$83WHVDqFmdfcR0f3MyhfruXJusUJcHjGNGy0hlbtJrwnAi1yCmzwK',
      role: Role.OWNER,
      globalStatus: GlobalStatus.ACTIVE,
      person: {
        connect: { id: person.id },
      },
    },
  });
  console.warn(`✅ Usuario propietario creado`);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@miparqueo.com',
      password: '$2b$10$83WHVDqFmdfcR0f3MyhfruXJusUJcHjGNGy0hlbtJrwnAi1yCmzwK',
      role: Role.ADMIN,
      globalStatus: GlobalStatus.ACTIVE,
    },
  });
  console.warn(`✅ Usuario admin creado`);

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
  const parkingLot = await prisma.parkingLot.create({
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

  await prisma.rating.create({
    data: {
      rating: 4.5,
      comment: 'Excelente parqueadero',
      globalStatus: GlobalStatus.ACTIVE,
      user: {
        connect: { id: admin.id },
      },
      parkingLot: {
        connect: { id: parkingLot.id },
      },
    },
  });
  console.warn('✅ Calificación creada');

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
