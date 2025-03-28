export type Config = {
  port: number;
  databaseUrl: string;
  clientUrl: string;
  jwt: {
    secret: string;
  };
  aws: {
    s3: {
      bucket: string;
    };
    accessKeyId: string;
    accessKeySecret: string;
    region: string;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  google: {
    maps: {
      apiKey: string;
      apiUrl: string;
    };
  };
};
