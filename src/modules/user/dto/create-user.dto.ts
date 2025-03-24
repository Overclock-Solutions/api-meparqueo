import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre/s del usuario',
    example: 'Andres Felipe',
    required: true,
  })
  @IsString()
  @IsNotEmpty({
    message: 'El nombre es requerido',
  })
  names: string;

  @ApiProperty({
    description: 'Apellido/s del usuario',
    example: 'Suarez Gonzalez',
    required: true,
  })
  @IsString()
  @IsNotEmpty({
    message: 'El apellido es requerido',
  })
  lastNames: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'example@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty({
    message: 'El email es requerido',
  })
  email: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: '3012345678',
    required: true,
  })
  @IsString()
  @IsNotEmpty({
    message: 'El número de teléfono es requerido',
  })
  phone: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password',
    required: true,
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
    required: false,
  })
  @IsString()
  @IsOptional()
  role: string;
}
