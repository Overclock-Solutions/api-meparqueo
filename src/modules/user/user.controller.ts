import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role, User } from '@prisma/client';
import {
  REPONSE_DELETE_USER_200,
  REPONSE_FIND_ALL_USER_200,
  RESPONSE_FIND_ONE_USER_200,
  RESPONSE_OWNER_409,
  RESPONSE_UPDATE_PASSWORD_200,
  RESPONSE_UPDATE_USER_200,
  RESPONSE_USER_201,
} from '../auth/docs/responses';
import {
  RESPONSE_FORBIDDEN_403,
  RESPONSE_UNAUTHORIZED_401,
} from '../common/docs/responses';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { CreateUserLocationDto } from './dto/create-user-location.dto';
import { CreateRecentlyParkedDto } from './dto/create-recently-parked.dto';
import { CreateUserSearchDto } from './dto/create-user-search.dto';
import { PaginatedRecentlyParkedResponseDto } from './dto/recently-parked-response.dto';
import { ActiveUser } from '../auth/decorators/session.decorator';

@ApiTags('Usuarios')
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
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, example: RESPONSE_USER_201 })
  @ApiResponse({ status: 409, example: RESPONSE_OWNER_409 })
  @ResponseMessage('Usuario registrado correctamente')
  @Auth([Role.ADMIN])
  async createOwner(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, example: REPONSE_FIND_ALL_USER_200 })
  @ResponseMessage('Usuarios encontrados')
  @Auth([Role.ADMIN])
  async findMany() {
    return this.userService.find();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener un usuario por Id' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, example: RESPONSE_FIND_ONE_USER_200 })
  @ResponseMessage('Usuario encontrado')
  @Auth([Role.ADMIN])
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Actualzar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({ type: CreateUserDto })
  @ResponseMessage('Usuario actualizado')
  @ApiResponse({ status: 200, example: RESPONSE_UPDATE_USER_200 })
  @Auth([Role.ADMIN])
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, example: REPONSE_DELETE_USER_200 })
  @ResponseMessage('Usuario eliminado')
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @Auth([Role.ADMIN])
  async delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Patch('change-password/:id')
  @ApiOperation({ summary: 'Cambiar contraseña' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({ status: 200, example: RESPONSE_UPDATE_PASSWORD_200 })
  @Auth([Role.ADMIN])
  async changePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.userService.changePassword(id, dto);
  }

  @Post('report')
  @ApiOperation({ summary: 'Crear un reporte' })
  @ApiBody({ type: CreateReportDto })
  @ResponseMessage('Reporte creado exitosamente')
  @Auth([Role.ADMIN])
  async createReport(@Body() dto: CreateReportDto) {
    return this.userService.createReport(dto);
  }

  @Post('location')
  @ApiOperation({ summary: 'Registrar ubicación de usuario' })
  @ApiBody({ type: CreateUserLocationDto })
  @ResponseMessage('Ubicación registrada exitosamente')
  @Auth([Role.USER])
  async createUserLocation(
    @Body() dto: CreateUserLocationDto,
    @ActiveUser() user: User,
  ) {
    return this.userService.createUserLocation(dto, user);
  }

  @Post('recently-parked')
  @ApiOperation({ summary: 'Registrar estacionamiento reciente' })
  @ApiBody({ type: CreateRecentlyParkedDto })
  @ResponseMessage('Estacionamiento reciente registrado')
  @Auth([Role.USER])
  async createRecentlyParked(
    @Body() dto: CreateRecentlyParkedDto,
    @ActiveUser() user: User,
  ) {
    return this.userService.createRecentlyParked(dto, user);
  }

  @Post('search')
  @ApiOperation({ summary: 'Registrar búsqueda de usuario' })
  @ApiBody({ type: CreateUserSearchDto })
  @ResponseMessage('Búsqueda registrada exitosamente')
  @Auth([Role.USER])
  async createUserSearch(
    @Body() dto: CreateUserSearchDto,
    @ActiveUser() user: User,
  ) {
    return this.userService.createUserSearch(dto, user);
  }

  @Get('recently/parked')
  @ApiOperation({ summary: 'Obtener parqueaderos recientes con paginación' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    type: PaginatedRecentlyParkedResponseDto,
  })
  @ResponseMessage('Parqueaderos recientes obtenidos')
  @Auth([Role.USER])
  async getRecentlyParked(
    @ActiveUser() user: User,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.userService.getRecentlyParked(
      user.id,
      Number(page),
      Number(limit),
    );
  }
}
