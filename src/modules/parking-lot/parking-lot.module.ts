import { Module } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { ParkingLotController } from './parking-lot.controller';
import { PrismaService } from 'src/core/prisma.service';

@Module({
  controllers: [ParkingLotController],
  providers: [ParkingLotService, PrismaService],
})
export class ParkingLotModule {}
