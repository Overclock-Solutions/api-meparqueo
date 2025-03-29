export const RESPONSE_SEND_TOPIC_NOTIFICATION_200 = {
  statusCode: 200,
  timestamp: '2025-03-29T03:53:14.281Z',
  success: true,
  message: 'Topic notification sent successfully',
  data: 'projects/meparqueo-push-notification/messages/501777111927275062',
};

export const RESPONSE_SEND_TOPIC_NOTIFICATION_400 = {
  statusCode: 400,
  timestamp: '2025-03-29T04:56:53.731Z',
  success: false,
  message: 'Algo salió mal.',
  errors: ['topic must be one of the following values: 0'],
};

export const RESPONSE_SUSCRIBE_TOPIC_201 = {
  statusCode: 201,
  timestamp: '2025-03-29T05:37:16.027Z',
  success: true,
  message: 'User subscribed to topic successfully',
  data: {
    successCount: 1,
    failureCount: 0,
    errors: [],
  },
};

export const RESPONSE_SUSCRIBE_TOPIC_500 = {
  statusCode: 500,
  timestamp: '2025-03-29T05:27:19.946Z',
  success: false,
  message: 'Algo salió mal.',
  errors: [
    'Registration token(s) provided to subscribeToTopic() must be a non-empty string or a non-empty array.',
  ],
};

export const RESPONSE_SUSCRIBE_TOPIC_404 = {
  statusCode: 404,
  timestamp: '2025-03-29T06:29:43.594Z',
  success: false,
  message: 'Algo salió mal.',
  errors: ['user with id 1177041e-1a0d-4b2f-b364-3ecd31fc7d82'],
};
