import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '@prisma/client';
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

@ApiTags('Usuarios (admin) ')
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
}
