import {
  PrismaClient,
  Role,
  ParkingLotStatus,
  ParkingLotAvailability,
  GlobalStatus,
  Version,
} from '@prisma/client';

const prisma = new PrismaClient();

// Función para generar coordenadas aleatorias dentro de un radio
function generateRandomCoordinates(
  baseLat: number,
  baseLng: number,
  radiusKm: number,
) {
  // Convertir radio de km a grados (aproximadamente)
  const radiusDegrees = radiusKm / 111.32;

  // Generar ángulo y distancia aleatorios
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radiusDegrees;

  // Calcular nuevas coordenadas
  const newLat = baseLat + distance * Math.cos(angle);
  const newLng = baseLng + distance * Math.sin(angle);

  return { latitude: newLat, longitude: newLng };
}

async function main() {
  console.warn('🗑️  Limpiando base de datos...');
  await prisma.parkingLotHistory.deleteMany({});
  await prisma.parkingLot.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.person.deleteMany({});
  await prisma.node.deleteMany({});

  console.warn('👤 Creando usuarios...');

  // Crear 10 dueños diferentes
  const owners = await Promise.all(
    [
      {
        names: 'Jhon',
        lastNames: 'Doe',
        phone: '3110000000',
        email: 'jhondoe@meparqueo.com',
      },
      {
        names: 'María',
        lastNames: 'García',
        phone: '3110000002',
        email: 'maria@meparqueo.com',
      },
      {
        names: 'Carlos',
        lastNames: 'Sánchez',
        phone: '3110000003',
        email: 'carlos@meparqueo.com',
      },
      {
        names: 'Ana',
        lastNames: 'Rodríguez',
        phone: '3110000004',
        email: 'ana@meparqueo.com',
      },
      {
        names: 'Luis',
        lastNames: 'Martínez',
        phone: '3110000005',
        email: 'luis@meparqueo.com',
      },
      {
        names: 'Pedro',
        lastNames: 'Gómez',
        phone: '3110000006',
        email: 'pedro@meparqueo.com',
      },
      {
        names: 'Laura',
        lastNames: 'Fernández',
        phone: '3110000007',
        email: 'laura@meparqueo.com',
      },
      {
        names: 'Ricardo',
        lastNames: 'López',
        phone: '3110000008',
        email: 'ricardo@meparqueo.com',
      },
      {
        names: 'Isabel',
        lastNames: 'Ramírez',
        phone: '3110000009',
        email: 'isabel@meparqueo.com',
      },
      {
        names: 'Jorge',
        lastNames: 'Pérez',
        phone: '3110000010',
        email: 'jorge@meparqueo.com',
      },
    ].map((personData) =>
      prisma.person.create({
        data: {
          ...personData,
          globalStatus: GlobalStatus.ACTIVE,
        },
      }),
    ),
  );

  // Crear usuarios asociados
  const users = await Promise.all(
    owners.map((owner) =>
      prisma.user.create({
        data: {
          email: owner.email,
          password:
            '$2b$10$83WHVDqFmdfcR0f3MyhfruXJusUJcHjGNGy0hlbtJrwnAi1yCmzwK',
          role: Role.OWNER,
          globalStatus: GlobalStatus.ACTIVE,
          person: { connect: { id: owner.id } },
        },
      }),
    ),
  );

  // Crear admin
  const personAdmin = await prisma.person.create({
    data: {
      names: 'Admin',
      lastNames: 'Admin',
      phone: '3110000001',
      email: 'admin@meparqueo.com',
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@meparqueo.com',
      password: '$2b$10$83WHVDqFmdfcR0f3MyhfruXJusUJcHjGNGy0hlbtJrwnAi1yCmzwK',
      role: Role.ADMIN,
      globalStatus: GlobalStatus.ACTIVE,
      person: { connect: { id: personAdmin.id } },
    },
  });

  console.warn(`✅ Usuarios creados`);

  console.warn('🅿️  Creando parqueaderos y nodos...');

  // Coordenadas base (Montería)
  const baseLat = 8.746125;
  const baseLng = -75.878538;
  const radiusKm = 15; // Radio de 15km

  // Servicios disponibles
  const allServices = [
    'SECURITY',
    'CAR_WASH',
    'COVERED',
    '24_HOURS',
    'VALET',
    'EVC_CHARGER',
    'MOTORCYCLE_AREA',
    'TRAILER_PARKING',
    'UNDERGROUND',
    'DISABLED_ACCESS',
    'TIRE_INFLATION',
  ];

  // Métodos de pago disponibles
  const allPaymentMethods = [
    'CASH',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'TRANSFER',
    'PAYMENT_APP',
    'MEMBERSHIP',
  ];

  // Nombres de calles y carreras en Montería
  const streets = [
    'Calle 10',
    'Calle 20',
    'Calle 30',
    'Calle 40',
    'Calle 50',
    'Carrera 5',
    'Carrera 10',
    'Carrera 15',
    'Carrera 20',
    'Avenida Circunvalar',
    'Avenida Primera',
    'Avenida Segunda',
  ];
  const neighborhoods = [
    'Centro',
    'La Rivera',
    'Buenavista',
    'Alamedas',
    'El Prado',
    'Los Almendros',
    'Las Palmas',
    'La Castellana',
    'La Pradera',
    'El Recreo',
    'La Floresta',
    'El Dorado',
    'Santa Fe',
    'La Victoria',
  ];

  // Generar 50 parqueaderos
  const parkingLotsData = Array.from({ length: 50 }, (_, i) => {
    const { latitude, longitude } = generateRandomCoordinates(
      baseLat,
      baseLng,
      radiusKm,
    );
    const street = streets[Math.floor(Math.random() * streets.length)];
    const number = Math.floor(Math.random() * 100) + 1;
    const neighborhood =
      neighborhoods[Math.floor(Math.random() * neighborhoods.length)];

    // Seleccionar servicios aleatorios (2-5 servicios)
    const numServices = Math.floor(Math.random() * 4) + 2;
    const services = [];
    for (let j = 0; j < numServices; j++) {
      const randomService =
        allServices[Math.floor(Math.random() * allServices.length)];
      if (!services.includes(randomService)) {
        services.push(randomService);
      }
    }

    // Seleccionar métodos de pago aleatorios (1-3 métodos)
    const numPaymentMethods = Math.floor(Math.random() * 3) + 1;
    const paymentMethods = [];
    for (let j = 0; j < numPaymentMethods; j++) {
      const randomMethod =
        allPaymentMethods[Math.floor(Math.random() * allPaymentMethods.length)];
      if (!paymentMethods.includes(randomMethod)) {
        paymentMethods.push(randomMethod);
      }
    }

    // Generar imágenes aleatorias (1-3 imágenes)
    const numImages = Math.floor(Math.random() * 3) + 1;
    const images = Array.from(
      { length: numImages },
      (_, imgIdx) => `parking${i + 1}_${imgIdx + 1}.jpg`,
    );

    return {
      code: `P${String(i + 1).padStart(3, '0')}`,
      name: `Parqueadero ${neighborhood} ${i + 1}`,
      address: `${street} #${number}-${Math.floor(Math.random() * 100)}, ${neighborhood}, Montería`,
      latitude,
      longitude,
      price: Math.floor(Math.random() * 2000) + 1000, // Entre 1000 y 3000
      services,
      paymentMethods,
      phone: `316${Math.floor(1000000 + Math.random() * 9000000)}`, // Número aleatorio
      availability:
        Math.random() > 0.7
          ? ParkingLotAvailability.NO_AVAILABILITY
          : Math.random() > 0.5
            ? ParkingLotAvailability.LESS_THAN_FIVE
            : ParkingLotAvailability.MORE_THAN_FIVE,
      status:
        Math.random() > 0.8 ? ParkingLotStatus.CLOSED : ParkingLotStatus.OPEN,
      images,
    };
  });

  for (const [index, parkingData] of parkingLotsData.entries()) {
    // Crear nodo
    const node = await prisma.node.create({
      data: {
        code: `ND${String(index + 1).padStart(3, '0')}`,
        version: Version.V1,
        globalStatus: GlobalStatus.ACTIVE,
      },
    });

    // Formatear imágenes para el formato JSON
    const formattedImages = parkingData.images.map((img, imgIndex) => ({
      key: `${parkingData.code}-${imgIndex + 1}`,
      url: `https://puertaselectricasgarecol.com/wp-content/uploads/2023/02/Puerta-Corrediza-Metalica20g-1.jpg`,
    }));

    // Crear parqueadero
    await prisma.parkingLot.create({
      data: {
        code: parkingData.code,
        name: parkingData.name,
        address: parkingData.address,
        latitude: parkingData.latitude,
        longitude: parkingData.longitude,
        status: parkingData.status,
        availability: parkingData.availability,
        price: parkingData.price,
        images: formattedImages,
        paymentMethods: parkingData.paymentMethods,
        services: parkingData.services,
        phoneNumber: parkingData.phone,
        globalStatus: GlobalStatus.ACTIVE,
        owner: { connect: { id: users[index % users.length].id } },
        nodes: { connect: { id: node.id } },
      },
    });
  }

  console.warn('✅ 50 Parqueaderos y nodos creados en un radio de 15km');

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
