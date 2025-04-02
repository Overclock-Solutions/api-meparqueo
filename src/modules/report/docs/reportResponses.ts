export const RESPONSE_CREATE_REPORT_200 = {
  statusCode: 201,
  timestamp: '2025-04-02T21:15:10.960Z',
  success: true,
  message: 'Report created sucessfully',
  data: {
    id: 'f606f659-f017-45d8-9386-6225a57ddc30',
    reason: 'INCORRECT_INFO',
    comment: 'Información incorrecta, no tiene baños',
    status: 'PENDING',
    globalStatus: 'ACTIVE',
    createdAt: '2025-04-02T21:15:10.939Z',
    updatedAt: '2025-04-02T21:15:10.939Z',
    userId: '61ec3d27-b269-4d34-9552-0f090b8eacbe',
    parkingLotId: '0438d2c4-4004-44f2-8d51-8eaed9c22375',
  },
};

export const RESPONSE_CREATE_REPORT_404 = {
  statusCode: 404,
  timestamp: '2025-04-02T21:16:59.627Z',
  success: false,
  message: 'Algo salió mal.',
  errors: [
    'This parking with id61ec3d27-b269-4d34-9552-0f090b8eacbe not found',
  ],
};

export const RESPONSE_FIND_ALL_PARKING_BY_ID_200 = {
  statusCode: 200,
  timestamp: '2025-04-02T21:21:36.156Z',
  success: true,
  message: 'Reports successfully found',
  data: {
    reports: [
      {
        id: 'dd6d277f-fcd8-4fae-84d3-ac7780228f43',
        reason: 'INCORRECT_INFO',
        comment: 'Información incorrecta, no tiene baños',
        status: 'PENDING',
        globalStatus: 'ACTIVE',
        createdAt: '2025-04-02T19:41:56.559Z',
        updatedAt: '2025-04-02T19:41:56.559Z',
        userId: '61ec3d27-b269-4d34-9552-0f090b8eacbe',
        parkingLotId: '0438d2c4-4004-44f2-8d51-8eaed9c22375',
      },
      {
        id: 'f606f659-f017-45d8-9386-6225a57ddc30',
        reason: 'INCORRECT_INFO',
        comment: 'Información incorrecta, no tiene baños',
        status: 'PENDING',
        globalStatus: 'ACTIVE',
        createdAt: '2025-04-02T21:15:10.939Z',
        updatedAt: '2025-04-02T21:15:10.939Z',
        userId: '61ec3d27-b269-4d34-9552-0f090b8eacbe',
        parkingLotId: '0438d2c4-4004-44f2-8d51-8eaed9c22375',
      },
    ],
    totalReports: 3,
    totalPages: 1,
    currentPage: 1,
  },
};

export const RESPONSE_FIND_ALL_PARKING_BY_ID_401 = {
  statusCode: 401,
  timestamp: '2025-04-02T21:27:25.429Z',
  success: false,
  message: 'Algo salió mal.',
  errors: ["U can't access to this resource"],
};

export const RESPONSE_FIND_REPORT_BY_ID_200 = {
  statusCode: 200,
  timestamp: '2025-04-02T21:42:06.968Z',
  success: true,
  message: 'Report successfully found',
  data: {
    id: 'dd6d277f-fcd8-4fae-84d3-ac7780228f43',
    reason: 'INCORRECT_INFO',
    comment: 'Información incorrecta, no tiene baños',
    status: 'PENDING',
    globalStatus: 'ACTIVE',
    createdAt: '2025-04-02T19:41:56.559Z',
    updatedAt: '2025-04-02T19:41:56.559Z',
    userId: '61ec3d27-b269-4d34-9552-0f090b8eacbe',
    parkingLotId: '0438d2c4-4004-44f2-8d51-8eaed9c22375',
  },
};

export const RESPONSE_UPDATE_REPORT_200 = {
  statusCode: 200,
  timestamp: '2025-04-02T20:39:27.949Z',
  success: true,
  message: 'Report successfully updated',
  data: {
    id: 'bfa5f80a-b1f2-425b-a8ec-0d9255d5df6b',
    reason: 'SAFETY_ISSUE',
    comment: 'Información incorrecta, no tiene baños',
    status: 'PENDING',
    globalStatus: 'ACTIVE',
    createdAt: '2025-04-02T19:43:04.897Z',
    updatedAt: '2025-04-02T20:39:27.947Z',
    userId: '61ec3d27-b269-4d34-9552-0f090b8eacbe',
    parkingLotId: '0438d2c4-4004-44f2-8d51-8eaed9c22375',
  },
};

export const RESPONSE_UPDATE_REPORT_404 = {
  statusCode: 404,
  timestamp: '2025-04-02T21:52:17.618Z',
  success: false,
  message: 'Algo salió mal.',
  errors: [
    "This report with idbfa5f80a-b1f2-425b-a8ec-0sd9255d5df6b doesn't exists",
  ],
};

export const RESPONSE_UPDATE_REPORT_401 = {
  statusCode: 401,
  timestamp: '2025-04-02T21:52:17.618Z',
  success: false,
  message: 'Algo salió mal.',
  errors: ["U can't access to this resource"],
};

export const RESPONSE_DELETE_REPORT_200 = {
  statusCode: 200,
  timestamp: '2025-04-02T21:52:17.618Z',
  success: true,
  message: 'Report successfully deleted',
  data: {
    id: 'bfa5f80a-b1f2-425b-a8ec-0d9255d5df6b',
    reason: 'SAFETY_ISSUE',
    comment: 'Información incorrecta, no tiene baños',
    status: 'PENDING',
    globalStatus: 'DELETED',
    createdAt: '2025-04-02T19:43:04.897Z',
    updatedAt: '2025-04-02T20:39:27.947Z',
    userId: '61ec3d27-b269-4d34-9552-0f090b8eacbe',
    parkingLotId: '0438d2c4-4004-44f2-8d51-8eaed9c22375',
  },
};

export const RESPONSE_DELETE_REPORT_404 = {
  statusCode: 404,
  timestamp: '2025-04-02T21:52:17.618Z',
  success: false,
  message: 'Algo salió mal.',
  errors: [
    "This report with idbfa5f80a-b1f2-425b-a8ec-0sd9255d5df6b doesn't exists",
  ],
};

export const RESPONSE_DELETE_REPORT_401 = {
  statusCode: 401,
  timestamp: '2025-04-02T21:52:17.618Z',
  success: false,
  message: 'Algo salió mal.',
  errors: ["U can't access to this resource"],
};
export const RESPONSE_FIND_USER_BY_ID_404 = {
  statusCode: 404,
  timestamp: '2025-04-02T21:52:17.618Z',
  success: false,
  message: 'Algo salió mal.',
  errors: [
    "This user with id61ec3d27-b269-4d34-9552-0f090b8eacbe doesn't exists",
  ],
};
