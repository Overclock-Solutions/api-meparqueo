import { Config } from 'src/types/config';

export default (): Config => {
  const {
    PORT,
    DATABASE_URL,
    JWT_SECRET,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    AWS_S3_BUCKET,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLIENT_URL,
    GOOGLE_MAPS_API_KEY,
    GOOGLE_MAPS_API_URL,
    FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL,
  } = process.env;
  if (!PORT || !DATABASE_URL || !JWT_SECRET) {
    throw new Error('Missing environment variables');
  }

  return {
    port: Number(PORT),
    databaseUrl: DATABASE_URL,
    clientUrl: CLIENT_URL,
    jwt: {
      secret: JWT_SECRET,
    },
    aws: {
      s3: {
        bucket: AWS_S3_BUCKET,
      },
      accessKeyId: AWS_ACCESS_KEY_ID,
      accessKeySecret: AWS_SECRET_ACCESS_KEY,
      region: AWS_REGION,
    },
    cloudinary: {
      apiKey: CLOUDINARY_API_KEY,
      apiSecret: CLOUDINARY_API_SECRET,
      cloudName: CLOUDINARY_CLOUD_NAME,
    },
    google: {
      maps: {
        apiKey: GOOGLE_MAPS_API_KEY,
        apiUrl: GOOGLE_MAPS_API_URL,
      },
    },
    firebase: {
      admin: {
        projectId: FIREBASE_PROJECT_ID,
        privateKey: FIREBASE_PRIVATE_KEY,
        clientEmail: FIREBASE_CLIENT_EMAIL,
      },
    },
  };
};
