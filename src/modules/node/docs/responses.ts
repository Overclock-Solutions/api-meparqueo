export const RESPONSE_CREATE_NODE_201 = {
  statusCode: 201,
  timestamp: '2025-02-27T20:04:51.092Z',
  success: true,
  message: 'Nodo creado correctamente',
  data: {
    id: 'b68c49e8-254f-4114-99e2-da8c0196af82',
    code: 'NODE003',
    version: 'V1',
    globalStatus: 'ACTIVE',
    createdAt: '2025-02-27T20:04:51.061Z',
    updatedAt: '2025-02-27T20:04:51.061Z',
  },
};

export const RESPONSE_CONFLICT_NODE_409 = {
  statusCode: 409,
  timestamp: '2025-02-27T20:17:03.544Z',
  success: false,
  message: 'Something went wrong.',
  errors: ["El código 'NODE003' ya está en uso"],
};

export const RESPONSE_FIND_ALL_NODES = {
  statusCode: 200,
  timestamp: '2025-02-27T21:13:15.505Z',
  success: true,
  message: 'Nodos encontrados correctamente',
  data: [
    {
      id: 'ffcc96a1-1d7c-4c92-8202-d9c0fa3d9ff9',
      code: 'ND002',
      version: 'BETA',
      globalStatus: 'ACTIVE',
      createdAt: '2025-02-27T04:59:53.167Z',
      updatedAt: '2025-02-27T04:59:53.167Z',
    },
    {
      id: 'b68c49e8-254f-4114-99e2-da8c0196af82',
      code: 'NODE003',
      version: 'V1',
      globalStatus: 'ACTIVE',
      createdAt: '2025-02-27T20:04:51.061Z',
      updatedAt: '2025-02-27T20:04:51.061Z',
    },
    {
      id: '86b433b5-db02-4163-9ad1-39face1a90f9',
      code: 'N-0001',
      version: 'BETA',
      globalStatus: 'ACTIVE',
      createdAt: '2025-02-27T21:12:30.160Z',
      updatedAt: '2025-02-27T21:12:30.160Z',
    },
  ],
};

export const RESPONSE_FIND_ONE_NODE = {
  statusCode: 200,
  timestamp: '2025-02-27T20:50:55.743Z',
  success: true,
  message: 'Nodo encontrado correctamente',
  data: {
    id: '4e4eb84d-3855-49a6-a8ec-1355a87803f3',
    code: 'ND001',
    version: 'BETA',
    globalStatus: 'ACTIVE',
    createdAt: '2025-02-27T04:59:53.159Z',
    updatedAt: '2025-02-27T04:59:53.159Z',
  },
};

export const RESPONSE_NOT_FOUND_NODE = {
  statusCode: 404,
  timestamp: '2025-02-27T20:53:47.392Z',
  success: false,
  message: 'Something went wrong.',
  errors: ['Nodo con id4e4eb84d-3855-49a6-a8ec-1355a87s803f3 no existe'],
};

export const RESPONSE_UPDATE_NODE = {
  statusCode: 200,
  timestamp: '2025-02-27T20:57:01.499Z',
  success: true,
  message: 'nodo actualizado correctamente',
  data: {
    id: '4e4eb84d-3855-49a6-a8ec-1355a87803f3',
    code: 'NODEV2',
    version: 'BETA',
    globalStatus: 'ACTIVE',
    createdAt: '2025-02-27T04:59:53.159Z',
    updatedAt: '2025-02-27T20:57:01.498Z',
  },
};

export const RESPONSE_CONFLICT_UPDATE_NODE = {
  statusCode: 409,
  timestamp: '2025-02-27T20:59:58.110Z',
  success: false,
  message: 'Something went wrong.',
  errors: ['No puedes actualizar a este código, porque ya está en uso'],
};

export const RESPONSE_DELETE_NODE = {
  statusCode: 200,
  timestamp: '2025-02-27T21:04:22.425Z',
  success: true,
  message: 'nodo eliminado correctamente',
  data: {
    id: '4e4eb84d-3855-49a6-a8ec-1355a87803f3',
    code: 'NODEV2',
    version: 'BETA',
    globalStatus: 'DELETED',
    createdAt: '2025-02-27T04:59:53.159Z',
    updatedAt: '2025-02-27T21:04:22.410Z',
  },
};
