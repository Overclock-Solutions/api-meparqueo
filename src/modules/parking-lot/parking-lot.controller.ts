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
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ParkingLot, Role } from '@prisma/client';
import { ParkingLotService } from './parking-lot.service';
import { CreateParkingLotDto } from './dto/create-parking-lot.dto';
import { UpdateParkingLotDto } from './dto/update-parking-lot.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { NearbyParamsDto } from './dto/nearby-param.dto';
import {
  RESPONSE_FIND_ALL,
  RESPONSE_FIND_NEARBY,
  RESPONSE_FIND_ONE,
  RESPONSE_GET_HISTORY,
  RESPONSE_UPDATE_STATUS,
  RESPONSE_UNAUTHORIZED_401,
  RESPONSE_FORBIDDEN_403,
  RESPONSE_CONFLICT_409,
  RESPONSE_CREATE,
  RESPONSE_UPDATE,
  RESPONSE_DELETE,
} from './docs/responses';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';

@Controller()
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token',
})
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
  example: RESPONSE_UNAUTHORIZED_401,
})
@ApiResponse({
  status: 403,
  description: 'Forbidden',
  example: RESPONSE_FORBIDDEN_403,
})
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Get('parking-lot')
  @ApiOperation({
    summary: 'Listar parqueaderos',
  })
  @ApiResponse({
    status: 200,
    example: RESPONSE_FIND_ALL,
  })
  @Auth([Role.ADMIN, Role.OWNER, Role.USER])
  @ResponseMessage('Parking lots found')
  findAll() {
    return this.parkingLotService.findAll();
  }

  @Get('parking-lot/:id')
  @ApiOperation({
    summary: 'Obtener parqueadero por su Id',
  })
  @ApiResponse({
    status: 200,
    example: RESPONSE_FIND_ONE,
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del parqueadero',
    example: 'ab068f85-76fb-46ed-b192-4d9664156011',
  })
  @Auth([Role.ADMIN, Role.OWNER, Role.USER])
  @ResponseMessage('Parking lot found')
  findOne(@Param('id') id: string) {
    return this.parkingLotService.findOne(id);
  }

  @Patch('parking-lot/:code/status')
  @ApiOperation({
    summary: 'Actualizar estado del parqueadero',
  })
  @ApiParam({
    name: 'code',
    description: 'Código del parqueadero',
    example: 'P001',
  })
  @ApiBody({
    type: UpdateStatusDto,
  })
  @ApiResponse({
    status: 200,
    example: RESPONSE_UPDATE_STATUS,
  })
  @ResponseMessage('Parking lot status updated')
  async updateStatus(
    @Param('code') code: string,
    @Body()
    updateDto: UpdateStatusDto,
  ): Promise<ParkingLot> {
    return this.parkingLotService.updateEstatus(code, updateDto);
  }

  @Get('parking-lot/find/nearby')
  @ApiOperation({
    summary: 'Buscar parqueaderos cercanos',
  })
  @ApiResponse({
    status: 200,
    example: RESPONSE_FIND_NEARBY,
  })
  @Auth([Role.USER, Role.OWNER, Role.ADMIN])
  @ResponseMessage('Parking lots found')
  async findNearby(@Query(ValidationPipe) query: NearbyParamsDto) {
    return this.parkingLotService.findNearby(
      query.lat,
      query.lng,
      query.radiusKm,
    );
  }

  @Post('/admin/parking-lot')
  @ApiOperation({
    summary: 'Crear parqueadero (admin)',
  })
  @ApiBody({ type: CreateParkingLotDto })
  @ApiResponse({
    status: 201,
    example: RESPONSE_CREATE,
  })
  @ApiResponse({
    status: 409,
    example: RESPONSE_CONFLICT_409,
  })
  @Auth([Role.ADMIN])
  @ResponseMessage('Parking lot created')
  create(@Body() createParkingLotDto: CreateParkingLotDto) {
    return this.parkingLotService.create(createParkingLotDto);
  }

  @Put('admin/parking-lot/:id')
  @ApiOperation({
    summary: 'Actualizar parqueadero (admin)',
  })
  @ApiBody({ type: CreateParkingLotDto, required: false })
  @ApiParam({
    name: 'id',
    description: 'Identificador del parqueadero',
    example: 'ab068f85-76fb-46ed-b192-4d9664156011',
  })
  @ApiResponse({
    status: 200,
    example: RESPONSE_UPDATE,
  })
  @Auth([Role.ADMIN])
  @ResponseMessage('Parking lot updated')
  update(
    @Param('id') id: string,
    @Body() updateParkingLotDto: UpdateParkingLotDto,
  ) {
    return this.parkingLotService.update(id, updateParkingLotDto);
  }

  @Delete('admin/parking-lot/:id')
  @ApiOperation({
    summary: 'Eliminar parqueadero (admin)',
  })
  @ApiResponse({
    example: RESPONSE_DELETE,
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del parqueadero',
    example: 'ab068f85-76fb-46ed-b192-4d9664156011',
  })
  @Auth([Role.ADMIN])
  @ResponseMessage('Parking lot deleted')
  remove(@Param('id') id: string) {
    return this.parkingLotService.remove(id);
  }

  @Get('admin/parking-lot/:id/history')
  @ApiOperation({
    summary: 'Obtener historial de parqueadero (admin)',
  })
  @ApiResponse({
    status: 200,
    example: RESPONSE_GET_HISTORY,
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
}
