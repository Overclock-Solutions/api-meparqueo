import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import configLoader from './lib/ConfigLoader';
import { LoggerConfiguredModule } from './lib/Logger';
import { PrismaService } from './core/prisma.service';
import { ResponseInterceptor } from './lib/ResponseInterceptor';
import { AuthModule } from './modules/auth/auth.module';
import { ParkingLotModule } from './modules/parking-lot/parking-lot.module';
import { NodeModule } from './modules/node/node.module';
import { UserModule } from './modules/user/user.module';
import {
  CloudStorageModule,
  StorageProviderType,
} from './modules/cloud-storage/cloud-storage.module';
import { WebSocketsModule } from './modules/common/socket/websockets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configLoader],
      isGlobal: true,
    }),
    CloudStorageModule.register({
      defaultProvider: StorageProviderType.CLOUDINARY,
      isGlobal: true,
    }),
    LoggerConfiguredModule,
    WebSocketsModule,
    AuthModule,
    ParkingLotModule,
    NodeModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, ResponseInterceptor],
})
export class AppModule {}
