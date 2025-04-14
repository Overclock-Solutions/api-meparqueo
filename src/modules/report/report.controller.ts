import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role, User } from '@prisma/client';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import { ActiveUser } from '../auth/decorators/session.decorator';
import {
  RESPONSE_FORBIDDEN_403,
  RESPONSE_UNAUTHORIZED_401,
} from '../common/docs/responses';
import {
  ApiBody,
  ApiExtraModels,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  RESPONSE_CREATE_REPORT_200,
  RESPONSE_CREATE_REPORT_404,
  RESPONSE_DELETE_REPORT_200,
  RESPONSE_DELETE_REPORT_401,
  RESPONSE_DELETE_REPORT_404,
  RESPONSE_FIND_ALL_PARKING_BY_ID_200,
  RESPONSE_FIND_ALL_PARKING_BY_ID_401,
  RESPONSE_FIND_REPORT_BY_ID_200,
  RESPONSE_UPDATE_REPORT_200,
  RESPONSE_UPDATE_REPORT_401,
  RESPONSE_UPDATE_REPORT_404,
} from './docs/reportResponses';

@ApiTags('Reportes')
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
@ApiExtraModels(CreateReportDto, UpdateReportDto)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post(':parkingLotId')
  @Auth([Role.USER])
  @ResponseMessage('Report created sucessfully')
  @ApiOperation({ summary: 'Registrar un nuevo reporte' })
  @ApiBody({ type: CreateReportDto })
  @ApiParam({ name: 'parkingLotId', description: 'ID del parqueadero' })
  @ApiResponse({ status: 200, example: RESPONSE_CREATE_REPORT_200 })
  @ApiResponse({ status: 404, example: RESPONSE_CREATE_REPORT_404 })
  create(
    @Body() createReportDto: CreateReportDto,
    @ActiveUser() user: User,
    @Param('parkingLotId') parkingLotId: string,
  ) {
    return this.reportService.create(createReportDto, user, parkingLotId);
  }

  @Get(':parkingLotId')
  @Auth([Role.ADMIN])
  @ApiOperation({
    summary: 'Obtener todos los reportes por id del parqueadero',
  })
  @ApiParam({ name: 'parkingLotId', description: 'ID del parqueadero' })
  @ApiQuery({
    name: 'page',
    description: 'pagina de la lista',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'limite de la pagina de la lista',
    required: false,
  })
  @ApiResponse({ status: 200, example: RESPONSE_FIND_ALL_PARKING_BY_ID_200 })
  @ApiResponse({ status: 404, example: RESPONSE_CREATE_REPORT_404 })
  @ApiResponse({ status: 401, example: RESPONSE_FIND_ALL_PARKING_BY_ID_401 })
  @ResponseMessage('Reports successfully found')
  findAllByParkingId(
    @Param('parkingLotId') parkingLotId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @ActiveUser() user: User,
  ) {
    return this.reportService.findAllByParkingId(
      parkingLotId,
      Number(page),
      Number(limit),
      user,
    );
  }

  @Get()
  @Auth([Role.USER])
  @ResponseMessage('Reports successfully found')
  @ApiOperation({
    summary: 'Obtener todos los reportes por id del usuario',
  })
  @ApiQuery({
    name: 'page',
    description: 'pagina de la lista',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'limite de la pagina de la lista',
    required: false,
  })
  @ApiResponse({ status: 200, example: RESPONSE_FIND_ALL_PARKING_BY_ID_200 })
  findAllByUserId(
    @ActiveUser() user: User,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.reportService.findAllByUserId(
      user,
      Number(page),
      Number(limit),
    );
  }

  @Get(':reportId/user')
  @Auth([Role.USER])
  @ResponseMessage('Report successfully found')
  @ApiOperation({ summary: 'Encontrar  un reporte por su id' })
  @ApiResponse({ status: 200, example: RESPONSE_FIND_REPORT_BY_ID_200 })
  @ApiResponse({ status: 401, example: RESPONSE_FIND_ALL_PARKING_BY_ID_401 })
  @ApiResponse({ status: 404, example: RESPONSE_UPDATE_REPORT_404 })
  @ApiParam({ name: 'reportId', description: 'ID del reporte' })
  findOne(@Param('reportId') reportId: string, @ActiveUser() user: User) {
    return this.reportService.findOne(reportId, user);
  }

  @Patch(':reportId')
  @Auth([Role.USER])
  @ResponseMessage('Report successfully updated')
  @ApiParam({ name: 'reportId', description: 'ID del reporte' })
  @ApiBody({ type: UpdateReportDto })
  @ApiResponse({ status: 200, example: RESPONSE_UPDATE_REPORT_200 })
  @ApiResponse({ status: 404, example: RESPONSE_UPDATE_REPORT_404 })
  @ApiResponse({ status: 401, example: RESPONSE_UPDATE_REPORT_401 })
  @ApiOperation({ summary: 'Actualizar un reporte' })
  update(
    @Param('reportId') reportId: string,
    @Body() updateReportDto: UpdateReportDto,
    @ActiveUser() user: User,
  ) {
    return this.reportService.update(reportId, updateReportDto, user);
  }

  @Delete(':reportId')
  @Auth([Role.USER])
  @ResponseMessage('Report successfully deleted')
  @ApiParam({ name: 'reportId', description: 'ID del reporte' })
  @ApiResponse({ status: 200, example: RESPONSE_DELETE_REPORT_200 })
  @ApiResponse({ status: 404, example: RESPONSE_DELETE_REPORT_404 })
  @ApiResponse({ status: 401, example: RESPONSE_DELETE_REPORT_401 })
  @ApiOperation({ summary: 'Eliminar un reporte' })
  remove(@Param('reportId') reportId: string, @ActiveUser() user: User) {
    return this.reportService.remove(reportId, user);
  }
}
