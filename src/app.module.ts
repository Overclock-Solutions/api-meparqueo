import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerConfiguredModule } from './lib/Logger';
import { PrismaService } from './core/prisma.service';
import { ResponseInterceptor } from './lib/ResponseInterceptor';

@Module({
  imports: [LoggerConfiguredModule],
  controllers: [AppController],
  providers: [PrismaService, ResponseInterceptor],
})
export class AppModule {}
