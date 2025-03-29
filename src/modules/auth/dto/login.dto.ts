import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'email del usuario',
    example: 'example@example.com',
  })
  @IsEmail()
  @IsNotEmpty({
    message: 'El email es requerido',
  })
  email: string;

  @ApiProperty({
    description: 'contraseña del usuario',
    example: 'password',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty({
    message: 'La contraseña es requerida',
  })
  password: string;

  @ApiProperty({
    description: 'token del usuario',
    example:
      'dCbT0jbLxJNbdF2nsnnoPn:APA91bGN-tDFzGrb9GiY3HpbWDAK4p2aIGJqrYeCwcCN9uN16eHYt5CVsG0ATHlq9Ap4xDhgITdA7FsKh3RrMlUKcutCqtRzfUgawFj320CSeI6lOzBEX5M',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  deviceId?: string;
}
