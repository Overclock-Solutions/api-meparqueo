import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
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
  RESPONSE_CONFLICT_409,
  RESPONSE_CREATE,
  RESPONSE_UPDATE,
  RESPONSE_DELETE,
} from './docs/responses';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import {
  RESPONSE_FORBIDDEN_403,
  RESPONSE_UNAUTHORIZED_401,
} from '../common/docs/responses';
import { WebhookPayloadDto } from './dto/webhook-payload.dto';

@ApiTags('Parqueaderos')
@ApiHeader({
  name: 'Authorization',
  description: 'Token Bearer',
})
@ApiResponse({
  status: 401,
  description: 'No autorizado',
  example: RESPONSE_UNAUTHORIZED_401,
})
@ApiResponse({
  status: 403,
  description: 'Prohibido',
  example: RESPONSE_FORBIDDEN_403,
})
@ApiExtraModels(CreateParkingLotDto, UpdateParkingLotDto, UpdateStatusDto)
@Controller()
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Get('parking-lot')
  @ApiOperation({ summary: 'Listar parqueaderos' })
  @ApiResponse({ status: 200, example: RESPONSE_FIND_ALL })
  @Auth()
  @ResponseMessage('Parqueaderos encontrados correctamente')
  findAll() {
    return this.parkingLotService.findAll();
  }

  @Get('parking-lot/:id')
  @ApiOperation({ summary: 'Obtener parqueadero por su ID' })
  @ApiResponse({ status: 200, example: RESPONSE_FIND_ONE })
  @ApiParam({
    name: 'id',
    description: 'Identificador del parqueadero',
    example: 'ab068f85-76fb-46ed-b192-4d9664156011',
  })
  @Auth()
  @ResponseMessage('Parqueadero encontrado correctamente')
  findOne(@Param('id') id: string) {
    return this.parkingLotService.findOne(id);
  }

  @Post('parking-lot/status')
  @ApiOperation({ summary: 'Webhook estado parqueadero' })
  @ApiBody({ type: WebhookPayloadDto })
  async updateStatus(@Body() webhookData: WebhookPayloadDto) {
    const { decoded_payload } = webhookData.uplink_message;
    this.parkingLotService.updateEstatus({
      code: decoded_payload.code,
      status: decoded_payload.status,
      availability: decoded_payload.availability,
    });
  }

  @Get('parking-lot/find/nearby')
  @ApiOperation({ summary: 'Buscar parqueaderos cercanos' })
  @ApiResponse({ status: 200, example: RESPONSE_FIND_NEARBY })
  @Auth([Role.USER])
  @ResponseMessage('Parqueaderos cercanos encontrados correctamente')
  async findNearby(@Query(ValidationPipe) query: NearbyParamsDto) {
    return this.parkingLotService.findNearby(
      query.lat,
      query.lng,
      query.radiusKm,
    );
  }

  @Post('/admin/parking-lot')
  @ApiOperation({ summary: 'Crear parqueadero (admin)' })
  @ApiBody({ type: CreateParkingLotDto })
  @ApiResponse({ status: 201, example: RESPONSE_CREATE })
  @ApiResponse({ status: 409, example: RESPONSE_CONFLICT_409 })
  @Auth([Role.ADMIN])
  @ResponseMessage('Parqueadero creado correctamente')
  create(@Body() createParkingLotDto: CreateParkingLotDto) {
    return this.parkingLotService.create(createParkingLotDto);
  }

  @Put('admin/parking-lot/:id')
  @ApiOperation({ summary: 'Actualizar parqueadero (admin)' })
  @ApiBody({ type: UpdateParkingLotDto, required: false })
  @ApiParam({
    name: 'id',
    description: 'Identificador del parqueadero',
    example: 'ab068f85-76fb-46ed-b192-4d9664156011',
  })
  @ApiResponse({ status: 200, example: RESPONSE_UPDATE })
  @Auth([Role.ADMIN])
  @ResponseMessage('Parqueadero actualizado correctamente')
  update(
    @Param('id') id: string,
    @Body() updateParkingLotDto: UpdateParkingLotDto,
  ) {
    return this.parkingLotService.update(id, updateParkingLotDto);
  }

  @Delete('admin/parking-lot/:id')
  @ApiOperation({ summary: 'Eliminar parqueadero (admin)' })
  @ApiResponse({ example: RESPONSE_DELETE })
  @ApiParam({
    name: 'id',
    description: 'Identificador del parqueadero',
    example: 'ab068f85-76fb-46ed-b192-4d9664156011',
  })
  @Auth([Role.ADMIN])
  @ResponseMessage('Parqueadero eliminado correctamente')
  remove(@Param('id') id: string) {
    return this.parkingLotService.remove(id);
  }

  @Get('admin/parking-lot/:id/history')
  @ApiOperation({ summary: 'Obtener historial de parqueadero (admin)' })
  @ApiResponse({ status: 200, example: RESPONSE_GET_HISTORY })
  @ApiParam({
    name: 'id',
    description: 'Identificador del parqueadero',
    example: 'ab068f85-76fb-46ed-b192-4d9664156011',
  })
  @Auth([Role.ADMIN])
  @ResponseMessage('Historial del parqueadero obtenido correctamente')
  async getHistory(@Param('id') id: string) {
    return this.parkingLotService.getHistory(id);
  }
}
