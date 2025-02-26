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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import {
  ParkingLot,
  ParkingLotAvailability,
  ParkingLotStatus,
  Role,
} from '@prisma/client';
import { ParkingLotService } from './parking-lot.service';
import { CreateParkingLotDto } from './dto/create-parking-lot.dto';
import { UpdateParkingLotDto } from './dto/update-parking-lot.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { NearbyParamsDto } from './dto/nearby-param.dto';
import {
  EXAMPLE_FIND_ALL,
  EXAMPLE_FIND_NEARBY,
  EXAMPLE_FIND_ONE,
  EXAMPLE_GET_HISTORY,
  EXAMPLE_UPDATE_STATUS,
} from './responses/responses-Iot';

@Controller('parking-lot')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear parqueadero',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateParkingLotDto })
  @ApiResponse({
    status: 201,
    example: {
      message: 'Parqueadero creado correctamente',
    },
  })
  @Auth([Role.ADMIN])
  create(@Body() createParkingLotDto: CreateParkingLotDto) {
    return this.parkingLotService.create(createParkingLotDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar parqueaderos',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    example: EXAMPLE_FIND_ALL,
  })
  @Auth([Role.ADMIN, Role.OWNER, Role.USER])
  findAll() {
    return this.parkingLotService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener parqueadero por su Id',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    example: EXAMPLE_FIND_ONE,
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del parqueadero',
    example: 'ab068f85-76fb-46ed-b192-4d9664156011',
  })
  @Auth([Role.ADMIN, Role.OWNER, Role.USER])
  findOne(@Param('id') id: string) {
    return this.parkingLotService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar parqueadero',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateParkingLotDto, required: false })
  @ApiParam({
    name: 'id',
    description: 'Identificador del parqueadero',
    example: 'ab068f85-76fb-46ed-b192-4d9664156011',
  })
  @ApiResponse({
    example: {
      mesasge: 'Parqueadero actualizado correctamente',
    },
  })
  @Auth([Role.ADMIN])
  update(
    @Param('id') id: string,
    @Body() updateParkingLotDto: UpdateParkingLotDto,
  ) {
    return this.parkingLotService.update(id, updateParkingLotDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar parqueadero',
  })
  @ApiBearerAuth()
  @ApiResponse({
    example: {
      message: 'Parqueadero eliminado correctamente',
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del parqueadero',
    example: 'ab068f85-76fb-46ed-b192-4d9664156011',
  })
  @Auth([Role.ADMIN])
  remove(@Param('id') id: string) {
    return this.parkingLotService.remove(id);
  }

  @Get(':id/history')
  @ApiOperation({
    summary: 'Obtener historial de parqueadero',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    example: EXAMPLE_GET_HISTORY,
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del parqueadero',
    example: 'ab068f85-76fb-46ed-b192-4d9664156011',
  })
  @Auth([Role.ADMIN])
  async getHistory(@Param('id') id: string) {
    return this.parkingLotService.getHistory(id);
  }

  @Patch(':code/status')
  @ApiOperation({
    summary: 'Actualizar estado del parqueadero',
  })
  @ApiParam({
    name: 'code',
    description: 'Código del parqueadero',
    example: 'P001',
  })
  @ApiBody({
    schema: EXAMPLE_UPDATE_STATUS,
  })
  @ApiResponse({
    status: 200,
    example: {
      message: 'Estado del parqueadero actualizado correctamente',
    },
  })
  @ApiBearerAuth()
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
  @ApiOperation({
    summary: 'Buscar parqueaderos cercanos',
  })
  @ApiResponse({
    status: 200,
    example: EXAMPLE_FIND_NEARBY,
  })
  @ApiBearerAuth()
  @Auth([Role.USER])
  async findNearby(@Query(ValidationPipe) query: NearbyParamsDto) {
    return this.parkingLotService.findNearby(
      query.lat,
      query.lng,
      query.radiusKm,
    );
  }
}
