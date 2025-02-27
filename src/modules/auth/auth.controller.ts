import { Controller, Post, Body, Get } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import {
  ApiHeader,
  ApiOperation,
  ApiProperty,
  ApiResponse,
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registro nuevo usuario' })
  @ApiProperty({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    example: RESPONSE_REGISTER_201,
  })
  @ApiResponse({
    status: 401,
    example: RESPONSE_REGISTER_401,
  })
  @ResponseMessage('User registered successfully')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiProperty({ type: LoginDto })
  @ApiResponse({
    status: 201,
    example: RESPONSE_LOGIN_201,
  })
  @ApiResponse({
    status: 401,
    example: RESPONSE_LOGIN_401,
  })
  @ResponseMessage('User logged in successfully')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiOperation({ summary: 'Obtener perfil' })
  @ApiResponse({
    status: 200,
    example: RESPONSE_ME_200,
  })
  @ApiResponse({
    status: 401,
    example: RESPONSE_ME_401,
  })
  @Auth([Role.ADMIN, Role.OWNER, Role.USER])
  @ResponseMessage('User details retrieved successfully')
  async me(@ActiveUser() user: User) {
    return this.authService.getMe(user.id);
  }
}
