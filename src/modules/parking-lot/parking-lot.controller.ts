import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { CreateParkingLotDto } from './dto/create-parking-lot.dto';
import { UpdateParkingLotDto } from './dto/update-parking-lot.dto';
import {
  ParkingLot,
  ParkingLotAvailability,
  ParkingLotStatus,
  Role,
} from '@prisma/client';
import { Auth } from '../auth/decorators/auth.decorator';
import { NearbyParamsDto } from './dto/nearby-param.dto';

@Controller('parking-lot')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Post()
  @Auth([Role.ADMIN])
  create(@Body() createParkingLotDto: CreateParkingLotDto) {
    return this.parkingLotService.create(createParkingLotDto);
  }

  @Get()
  @Auth([Role.ADMIN, Role.OWNER, Role.USER])
  findAll() {
    return this.parkingLotService.findAll();
  }

  @Get(':id')
  @Auth([Role.ADMIN, Role.OWNER, Role.USER])
  findOne(@Param('id') id: string) {
    return this.parkingLotService.findOne(id);
  }

  @Patch(':id')
  @Auth([Role.ADMIN])
  update(
    @Param('id') id: string,
    @Body() updateParkingLotDto: UpdateParkingLotDto,
  ) {
    return this.parkingLotService.update(id, updateParkingLotDto);
  }

  @Delete(':id')
  @Auth([Role.ADMIN])
  remove(@Param('id') id: string) {
    return this.parkingLotService.remove(id);
  }

  @Get(':id/history')
  @Auth([Role.ADMIN])
  async getHistory(@Param('id') id: string) {
    return this.parkingLotService.getHistory(id);
  }

  @Patch(':id/status')
  async updateEstatus(
    @Param('code') code: string,
    @Body()
    updateDto: {
      status?: ParkingLotStatus;
      availability?: ParkingLotAvailability;
    },
  ): Promise<ParkingLot> {
    return this.parkingLotService.updateEstatus(code, updateDto);
  }

  @Get('/find-nearby')
  @Auth([Role.USER])
  async findNearby(@Query(ValidationPipe) query: NearbyParamsDto) {
    return this.parkingLotService.findNearby(
      query.lat,
      query.lng,
      query.radiusKm,
    );
  }
}
