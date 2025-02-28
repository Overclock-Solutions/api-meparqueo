export const RESPONSE_REGISTER_201 = {
  statusCode: 201,
  timestamp: '2025-02-26T18:30:25.873Z',
  success: true,
  message: 'User registered successfully',
  data: {
    id: '28a837e3-7cb4-4003-b34c-a3d9a3793961',
    email: 'example@example.com',
    password: '$2b$10$XOiNDT2tdAsTZfGGdt6dHurfoDhHhC6RAnUI3nRUD8HA00va3l0XS',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2025-02-26T18:30:25.846Z',
    updatedAt: '2025-02-26T18:30:25.846Z',
  },
};

export const RESPONSE_REGISTER_401 = {
  statusCode: 401,
  timestamp: '2025-02-26T18:37:51.211Z',
  success: false,
  message: 'Algo salió mal.',
  errors: ['El correo electrónico ya está en uso'],
};

export const RESPONSE_LOGIN_201 = {
  statusCode: 201,
  timestamp: '2025-02-26T18:41:23.780Z',
  success: true,
  message: 'User logged in successfully',
  data: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOGE4MzdlMy03Y2I0LTQwMDMtYjM0Yy1hM2Q5YTM3OTM5NjEiLCJlbWFpbCI6ImV4YW1wbGVAZXhhbXBsZS5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc0MDU5NTI4MywiZXhwIjoxNzQwNjgxNjgzfQ.ay6dP96eXdVhVnnOrRseOaotoURBsHODmXRqPYQVrFU',
    user: {
      id: '28a837e3-7cb4-4003-b34c-a3d9a3793961',
      email: 'example@example.com',
      password: '$2b$10$XOiNDT2tdAsTZfGGdt6dHurfoDhHhC6RAnUI3nRUD8HA00va3l0XS',
      role: 'USER',
      status: 'ACTIVE',
      createdAt: '2025-02-26T18:30:25.846Z',
      updatedAt: '2025-02-26T18:30:25.846Z',
    },
  },
};

export const RESPONSE_LOGIN_401 = {
  statusCode: 401,
  timestamp: '2025-02-26T18:45:20.970Z',
  success: false,
  message: 'Algo salió mal.',
  errors: ['Credenciales inválidas'],
};

export const RESPONSE_ME_200 = {
  statusCode: 200,
  timestamp: '2025-02-26T18:55:39.046Z',
  success: true,
  message: 'User details retrieved successfully',
  data: {
    id: '28a837e3-7cb4-4003-b34c-a3d9a3793961',
    email: 'example@example.com',
    password: '$2b$10$XOiNDT2tdAsTZfGGdt6dHurfoDhHhC6RAnUI3nRUD8HA00va3l0XS',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2025-02-26T18:30:25.846Z',
    updatedAt: '2025-02-26T18:30:25.846Z',
  },
};

export const RESPONSE_ME_401 = {
  statusCode: 401,
  timestamp: '2025-02-26T18:58:05.479Z',
  success: false,
  message: 'Algo salió mal.',
  errors: ['Unauthorized'],
};
