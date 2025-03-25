import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudStorageService } from './cloud-storage.service';
import { CloudStorageController } from './cloud-storage.controller';
import { CloudinaryProvider, AwsS3Provider } from './providers';

export enum StorageProviderType {
  CLOUDINARY = 'cloudinary',
  AWS_S3 = 's3',
}

export interface CloudStorageOptions {
  defaultProvider: StorageProviderType;
  isGlobal?: boolean;
}

@Module({})
export class CloudStorageModule {
  static register(options: CloudStorageOptions): DynamicModule {
    const storageProviderFactory: Provider = {
      provide: 'STORAGE_PROVIDER',
      useFactory: (
        cloudinaryProvider: CloudinaryProvider,
        awsS3Provider: AwsS3Provider,
      ) => {
        switch (options.defaultProvider) {
          case StorageProviderType.CLOUDINARY:
            return cloudinaryProvider;
          case StorageProviderType.AWS_S3:
            return awsS3Provider;
          default:
            return cloudinaryProvider; // Valor por defecto
        }
      },
      inject: [CloudinaryProvider, AwsS3Provider],
    };

    return {
      module: CloudStorageModule,
      imports: [ConfigModule],
      controllers: [CloudStorageController],
      providers: [
        CloudStorageService,
        CloudinaryProvider,
        AwsS3Provider,
        storageProviderFactory,
      ],
      exports: [CloudStorageService],
      global: options.isGlobal || false,
    };
  }
}
