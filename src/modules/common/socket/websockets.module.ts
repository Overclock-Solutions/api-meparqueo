import { Module } from '@nestjs/common';
import { GlobalGateway } from './global.gateway';
import { AuthModule } from 'src/modules/auth/auth.module';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule],
  providers: [GlobalGateway, JwtService, ConfigService, JwtStrategy],
  exports: [GlobalGateway],
})
export class WebSocketsModule {}
