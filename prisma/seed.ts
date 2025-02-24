import {
  PrismaClient,
  Role,
  ParkingLotStatus,
  ParkingLotAvailability,
  GlobalStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos existentes (en orden por relaciones)
  await prisma.parkingLotHistory.deleteMany({});
  await prisma.parkingLot.deleteMany({});
  await prisma.user.deleteMany({});

  // Crear usuarios
  await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: '$2b$10$83WHVDqFmdfcR0f3MyhfruXJusUJcHjGNGy0hlbtJrwnAi1yCmzwK',
      role: Role.ADMIN,
      status: GlobalStatus.ACTIVE,
    },
  });

  const ownerUser = await prisma.user.create({
    data: {
      email: 'owner@gmail.com',
      password: '$2b$10$83WHVDqFmdfcR0f3MyhfruXJusUJcHjGNGy0hlbtJrwnAi1yCmzwK',
      role: Role.OWNER,
      status: GlobalStatus.ACTIVE,
    },
  });

  await prisma.user.create({
    data: {
      email: 'user@gmail.com',
      password: '$2b$10$83WHVDqFmdfcR0f3MyhfruXJusUJcHjGNGy0hlbtJrwnAi1yCmzwK',
      role: Role.USER,
      status: GlobalStatus.ACTIVE,
    },
  });

  // Crear parqueaderos asignados al usuario owner
  const parkingLot1 = await prisma.parkingLot.create({
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
        connect: { id: ownerUser.id },
      },
    },
  });

  // Registrar historiales de actualizaciones para los parqueaderos
  await prisma.parkingLotHistory.createMany({
    data: [
      {
        parkingLotId: parkingLot1.id,
        status: ParkingLotStatus.CLOSED,
        availability: ParkingLotAvailability.NO_AVAILABILITY,
      },
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
