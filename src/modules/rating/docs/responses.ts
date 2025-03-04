export const RESPONSE_CREATE_RATING_201 = {
  statusCode: 201,
  timestamp: '2025-03-04T03:19:06.583Z',
  success: true,
  message: 'Calificación creada con exito',
  data: {
    id: '9ba354c2-4a4c-4c74-9ea7-5b307f24bdbf',
    rating: 5,
    comment: 'Pudo haber sido mejor',
    userId: '1a712e68-ec04-4567-8cb8-ce90ca5dc377',
    parkingLotId: '130297e9-939f-4933-9e52-ad24827085a5',
    globalStatus: 'ACTIVE',
    createdAt: '2025-03-04T02:30:17.787Z',
    updatedAt: '2025-03-04T03:19:06.438Z',
  },
};

export const RESPONSE_FIND_ALL_RATINGS_BY_PARKING = {
  statusCode: 200,
  timestamp: '2025-03-04T03:15:00.892Z',
  success: true,
  message: 'Calificaciones obtenidas con exito',
  data: {
    total: 2,
    page: 1,
    limit: 10,
    totalPages: 1,
    ratings: [
      {
        id: 'e9c20e33-c7cf-44ad-b68f-4bbf4f6d026b',
        rating: 2,
        comment: 'Pudo haber sido mejor',
        userId: '1b30ad1f-d8e8-4065-9a13-4cf44d377fc4',
        parkingLotId: '45d6616d-bd94-474b-a6ff-04e446627b04',
        globalStatus: 'ACTIVE',
        createdAt: '2025-03-03T16:28:41.137Z',
        updatedAt: '2025-03-04T02:18:49.606Z',
      },
      {
        id: 'fa83afcf-95fa-4afa-9d3d-59cdc7d20be1',
        rating: 4,
        comment: 'Pudo haber sido mejor',
        userId: '1a712e68-ec04-4567-8cb8-ce90ca5dc377',
        parkingLotId: '45d6616d-bd94-474b-a6ff-04e446627b04',
        globalStatus: 'ACTIVE',
        createdAt: '2025-03-03T16:50:04.876Z',
        updatedAt: '2025-03-04T02:17:42.089Z',
      },
    ],
  },
};

export const RESPONSE_FIND_ONE_RATING = {
  statusCode: 200,
  timestamp: '2025-03-04T03:20:25.442Z',
  success: true,
  message: 'Calificacion obtenida con exito',
  data: {
    id: 'fa83afcf-95fa-4afa-9d3d-59cdc7d20be1',
    rating: 4,
    comment: 'Pudo haber sido mejor',
    userId: '1a712e68-ec04-4567-8cb8-ce90ca5dc377',
    parkingLotId: '45d6616d-bd94-474b-a6ff-04e446627b04',
    globalStatus: 'ACTIVE',
    createdAt: '2025-03-03T16:50:04.876Z',
    updatedAt: '2025-03-04T02:17:42.089Z',
  },
};

export const RESPONSE_DELETE_RATING = {
  statusCode: 200,
  timestamp: '2025-03-04T03:24:07.729Z',
  success: true,
  message: 'Calificacion eliminada',
  data: {
    id: 'fa83afcf-95fa-4afa-9d3d-59cdc7d20be1',
    rating: 4,
    comment: 'Pudo haber sido mejor',
    userId: '1a712e68-ec04-4567-8cb8-ce90ca5dc377',
    parkingLotId: '45d6616d-bd94-474b-a6ff-04e446627b04',
    globalStatus: 'DELETED',
    createdAt: '2025-03-03T16:50:04.876Z',
    updatedAt: '2025-03-04T03:24:07.692Z',
  },
};

export const RESPONSE_CONFLICT_RATING_409 = {
  statusCode: 409,
  timestamp: '2025-03-04T03:26:28.495Z',
  success: false,
  message: 'Algo salió mal.',
  errors: ['No puedes crear este recurso en nombre de otro'],
};

export const RESPONSE_NOT_FOUND_RATING = {
  statusCode: 404,
  timestamp: '2025-03-04T03:29:20.070Z',
  success: false,
  message: 'Algo salió mal.',
  errors: [
    'La calificación con ID fa83afcf-95fa-4afa-9d3d-59cdc7d20beS1 no existe.',
  ],
};

export const RESPONSE_CONFLICT_DELETE_RATING_409 = {
  statusCode: 409,
  timestamp: '2025-03-04T03:34:10.847Z',
  success: false,
  message: 'Algo salió mal.',
  errors: ['No puedes acceder a este recurso'],
};
