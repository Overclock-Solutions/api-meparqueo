import { Controller, Post, Body, Get } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import {
  ApiTags,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ActiveUser } from './decorators/session.decorator';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import { Auth } from './decorators/auth.decorator';
import {
  RESPONSE_LOGIN_201,
  RESPONSE_LOGIN_401,
  RESPONSE_ME_200,
  RESPONSE_ME_401,
  RESPONSE_REGISTER_201,
  RESPONSE_REGISTER_401,
} from './docs/responses';

@ApiTags('Autenticacion')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token',
})
@ApiResponse({
  status: 401,
  description: 'No autorizado',
  example: RESPONSE_LOGIN_401,
})
@ApiExtraModels(RegisterDto, LoginDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, example: RESPONSE_REGISTER_201 })
  @ApiResponse({ status: 401, example: RESPONSE_REGISTER_401 })
  @ResponseMessage('Usuario registrado correctamente')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, example: RESPONSE_LOGIN_201 })
  @ApiResponse({ status: 401, example: RESPONSE_LOGIN_401 })
  @ResponseMessage('Usuario autenticado correctamente')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, example: RESPONSE_ME_200 })
  @ApiResponse({ status: 401, example: RESPONSE_ME_401 })
  @Auth([Role.ADMIN, Role.OWNER, Role.USER])
  @ResponseMessage('Perfil del usuario obtenido correctamente')
  async me(@ActiveUser() user: User) {
    return this.authService.getMe(user.id);
  }
}
