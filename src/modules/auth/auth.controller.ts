import { Controller, Post, Body, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ActiveUser } from './decorators/session.decorator';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiProperty({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    example: {
      user: {
        id: '1',
        email: 'example@example.com',
        password: 'password',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
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
    example: {
      token: 'adjawd82913u12',
      user: {
        id: '1',
        email: 'example@example.com',
        password: 'password',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  })
  @ResponseMessage('User logged in successfully')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener detalles del usuario autenticado' })
  @ApiResponse({
    status: 200,
    example: {
      user: {
        id: '1',
        email: 'example@example.com',
        password: 'password',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  })
  @Auth()
  @ResponseMessage('User details retrieved successfully')
  async me(@ActiveUser() user: User) {
    return this.authService.getMe(user.id);
  }
}
