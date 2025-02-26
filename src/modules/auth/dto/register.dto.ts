import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'example@example.com',
  })
  @IsEmail()
  @IsNotEmpty({
    message: 'El email es requerido',
  })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty({
    message: 'La contraseña es requerida',
  })
  password: string;

  @ApiProperty({
    description: 'Rol del usuario',
    example: 'USER',
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
