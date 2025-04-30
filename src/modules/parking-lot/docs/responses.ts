export const RESPONSE_FIND_ALL = {
  statusCode: 200,
  timestamp: '2025-02-26T19:44:53.236Z',
  success: true,
  message: 'Parqueaderos encontrados correctamente',
  data: [
    {
      id: '2f33795b-c470-4657-9ba9-cec309a8f7ea',
      code: 'P001',
      name: 'Parqueadero',
      address: 'Calle 27 &, Av. 1, Montería',
      latitude: 8.7554462,
      longitude: -75.8889753,
      status: 'OPEN',
      availability: 'MORE_THAN_FIVE',
      globalStatus: 'ACTIVE',
      createdAt: '2025-02-26T19:33:47.899Z',
      updatedAt: '2025-02-26T19:33:47.899Z',
      ownerId: 'ba94c1a1-c2d2-47de-91cb-1ebfcf914647',
    },
  ],
};

export const RESPONSE_FIND_ONE = {
  statusCode: 200,
  timestamp: '2025-02-26T19:49:03.065Z',
  success: true,
  message: 'Parqueadero encontrado correctamente',
  data: {
    id: '2f33795b-c470-4657-9ba9-cec309a8f7ea',
    code: 'P001',
    name: 'Parqueadero',
    address: 'Calle 27 &, Av. 1, Montería',
    latitude: 8.7554462,
    longitude: -75.8889753,
    status: 'OPEN',
    availability: 'MORE_THAN_FIVE',
    globalStatus: 'ACTIVE',
    createdAt: '2025-02-26T19:33:47.899Z',
    updatedAt: '2025-02-26T19:33:47.899Z',
    ownerId: 'ba94c1a1-c2d2-47de-91cb-1ebfcf914647',
  },
};

export const RESPONSE_GET_HISTORY = {
  statusCode: 200,
  timestamp: '2025-02-27T05:17:27.637Z',
  success: true,
  message: 'Historial del parqueadero obtenido correctamente',
  data: [
    {
      id: '1e4661d6-4881-4c99-ab61-824feb484af1',
      parkingLotId: '2f33795b-c470-4657-9ba9-cec309a8f7ea',
      status: 'OPEN',
      availability: 'MORE_THAN_FIVE',
      updatedAt: '2025-02-26T20:00:04.748Z',
    },
    {
      id: 'e20bff33-fa73-49bf-868e-77edcb35133a',
      parkingLotId: '2f33795b-c470-4657-9ba9-cec309a8f7ea',
      status: 'OPEN',
      availability: 'MORE_THAN_FIVE',
      updatedAt: '2025-02-26T19:58:10.416Z',
    },
    {
      id: '7952a013-b3a5-4998-b5e0-ad13dfa16d95',
      parkingLotId: '2f33795b-c470-4657-9ba9-cec309a8f7ea',
      status: 'OPEN',
      availability: 'MORE_THAN_FIVE',
      updatedAt: '2025-02-26T19:49:57.160Z',
    },
    {
      id: '49d173b1-ec24-4954-a51e-ec461a767177',
      parkingLotId: '2f33795b-c470-4657-9ba9-cec309a8f7ea',
      status: 'CLOSED',
      availability: 'NO_AVAILABILITY',
      updatedAt: '2025-02-26T19:33:47.917Z',
    },
  ],
};

export const RESPONSE_FIND_NEARBY = {
  statusCode: 200,
  timestamp: '2025-03-29T06:30:42.367Z',
  success: true,
  message: 'Parqueaderos cercanos encontrados correctamente',
  data: [
    {
      id: '712e3ff6-f3c4-46a6-af15-084e84c0ccfa',
      code: 'P001',
      name: 'Parqueadero el Pino',
      address: 'Calle 76 Carrera 5, San Francisco',
      latitude: 8.78560421143905,
      longitude: -75.86145271152776,
      status: 'OPEN',
      availability: 'MORE_THAN_FIVE',
      price: 2500,
      images: [
        {
          key: 'parking-lots/parking-lots/1743052942663-parqueadero-estacionamiento-jose-patino-1509241765',
          url: 'https://res.cloudinary.com/dxuauzyp9/image/upload/v1743052943/parking-lots/parking-lots/1743052942663-parqueadero-estacionamiento-jose-patino-1509241765.webp',
        },
      ],
      paymentMethods: [
        'CASH',
        'TRANSFER',
        'BANCOLOMBIA_APP',
        'MEMBERSHIP',
        'CREDIT_CARD',
        'PAY_LATER',
      ],
      services: [
        'CAR_WASH',
        'SECURITY',
        'WI_FI',
        'INSURANCE',
        'LOCKER_SERVICE',
        'VIDEO_SURVEILLANCE',
      ],
      phoneNumber: '3117589284',
      globalStatus: 'ACTIVE',
      ownerId: '02e39db7-5266-4599-a67f-b8d186d6173d',
      createdAt: '2025-03-27T05:22:24.053Z',
      updatedAt: '2025-03-29T04:59:01.278Z',
      imageUrls: [
        'https://res.cloudinary.com/dxuauzyp9/image/upload/v1743052943/parking-lots/parking-lots/1743052942663-parqueadero-estacionamiento-jose-patino-1509241765.webp',
      ],
      distanceMt: 520,
      durationMin: 70,
    },
  ],
};

export const RESPONSE_CREATE = {
  statusCode: 201,
  timestamp: '2025-02-27T05:07:10.305Z',
  success: true,
  message: 'Parqueadero creado correctamente',
  data: {
    id: '46c78885-ec61-4708-bbaa-de729abdad91',
    code: 'P002',
    name: 'Parqueadero',
    address: 'Calle 27 &, Av. 1, Montería',
    latitude: 8.7554462,
    longitude: -75.8889753,
    status: 'OPEN',
    availability: 'MORE_THAN_FIVE',
    globalStatus: 'ACTIVE',
    createdAt: '2025-02-27T05:07:10.302Z',
    updatedAt: '2025-02-27T05:07:10.302Z',
    ownerId: 'ba94c1a1-c2d2-47de-91cb-1ebfcf914647',
  },
};

export const RESPONSE_UPDATE = {
  statusCode: 200,
  timestamp: '2025-02-27T05:12:08.831Z',
  success: true,
  message: 'Parqueadero actualizado correctamente',
  data: {
    id: '46c78885-ec61-4708-bbaa-de729abdad91',
    code: 'P002',
    name: 'Parqueadero',
    address: 'Calle 27 &, Av. 1, Montería',
    latitude: 8.7554462,
    longitude: -75.8889753,
    status: 'OPEN',
    availability: 'MORE_THAN_FIVE',
    globalStatus: 'ACTIVE',
    createdAt: '2025-02-27T05:07:10.302Z',
    updatedAt: '2025-02-27T05:12:08.825Z',
    ownerId: 'ba94c1a1-c2d2-47de-91cb-1ebfcf914647',
  },
};

export const RESPONSE_DELETE = {
  statusCode: 200,
  timestamp: '2025-02-27T05:16:17.016Z',
  success: true,
  message: 'Parqueadero eliminado correctamente',
  data: {
    id: '46c78885-ec61-4708-bbaa-de729abdad91',
    code: 'P002',
    name: 'Parqueadero',
    address: 'Calle 27 &, Av. 1, Montería',
    latitude: 8.7554462,
    longitude: -75.8889753,
    status: 'OPEN',
    availability: 'MORE_THAN_FIVE',
    globalStatus: 'DELETED',
    createdAt: '2025-02-27T05:07:10.302Z',
    updatedAt: '2025-02-27T05:16:17.006Z',
    ownerId: 'ba94c1a1-c2d2-47de-91cb-1ebfcf914647',
  },
};

export const RESPONSE_CONFLICT_409 = {
  statusCode: 409,
  timestamp: '2025-02-27T05:03:16.667Z',
  success: false,
  message: 'Algo salió mal.',
  errors: ['Parking lot with code P001 already exists'],
};
