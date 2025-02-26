export const EXAMPLE_FIND_ALL = {
  statusCode: 200,
  timestamp: '2025-02-25T18:42:16.162Z',
  success: true,
  message: 'OK',
  data: [
    {
      id: 'ab068f85-76fb-46ed-b192-4d9664156011',
      code: 'P001',
      name: 'Parqueadero',
      address: 'Calle 27 &, Av. 1, Montería',
      latitude: 8.7554462,
      longitude: -75.8889753,
      status: 'OPEN',
      availability: 'MORE_THAN_FIVE',
      globalStatus: 'ACTIVE',
      createdAt: '2025-02-25T06:06:58.902Z',
      updatedAt: '2025-02-25T06:06:58.902Z',
      ownerId: '5e21e6b8-61dc-4936-85ca-b77dc72359c6',
    },
  ],
};
export const EXAMPLE_FIND_ONE = {
  statusCode: 200,
  timestamp: '2025-02-25T18:48:44.162Z',
  success: true,
  message: 'OK',
  data: {
    id: 'ab068f85-76fb-46ed-b192-4d9664156011',
    code: 'P001',
    name: 'Parqueadero',
    address: 'Calle 27 &, Av. 1, Montería',
    latitude: 8.7554462,
    longitude: -75.8889753,
    status: 'OPEN',
    availability: 'MORE_THAN_FIVE',
    globalStatus: 'ACTIVE',
    createdAt: '2025-02-25T06:06:58.902Z',
    updatedAt: '2025-02-25T06:06:58.902Z',
    ownerId: '5e21e6b8-61dc-4936-85ca-b77dc72359c6',
  },
};

export const EXAMPLE_GET_HISTORY = {
  statusCode: 200,
  timestamp: '2025-02-25T19:04:08.860Z',
  success: true,
  message: 'OK',
  data: [
    {
      id: 'bab8adda-dd56-4810-be5a-1f5459b2065d',
      parkingLotId: 'ab068f85-76fb-46ed-b192-4d9664156011',
      status: 'CLOSED',
      availability: 'NO_AVAILABILITY',
      updatedAt: '2025-02-25T06:06:58.923Z',
    },
  ],
};

export const EXAMPLE_UPDATE_STATUS = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['OPEN', 'CLOSED'],
    },
    availability: {
      type: 'string',
      enum: [
        'MORE_THAN_FIVE',
        'BETWEEN_ONE_AND_FIVE',
        'LESS_THAN_ONE',
        'NO_AVAILABILITY',
      ],
    },
  },
};

export const EXAMPLE_FIND_NEARBY = {
  statusCode: 200,
  timestamp: '2025-02-26T06:02:08.621Z',
  success: true,
  message: 'OK',
  data: null,
};
