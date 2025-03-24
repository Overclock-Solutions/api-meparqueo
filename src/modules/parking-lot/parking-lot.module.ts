import { Module } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { ParkingLotController } from './parking-lot.controller';
import { PrismaService } from 'src/core/prisma.service';
import { WebSocketsModule } from '../common/socket/websockets.module';

@Module({
  imports: [WebSocketsModule],
  controllers: [ParkingLotController],
  providers: [ParkingLotService, PrismaService],
})
export class ParkingLotModule {}
