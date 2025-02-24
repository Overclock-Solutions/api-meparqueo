import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerConfiguredModule } from './lib/Logger';
import { PrismaService } from './core/prisma.service';
import { ResponseInterceptor } from './lib/ResponseInterceptor';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [LoggerConfiguredModule, AuthModule],
  controllers: [AppController],
  providers: [PrismaService, ResponseInterceptor],
})
export class AppModule {}
