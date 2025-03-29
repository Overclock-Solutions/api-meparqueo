import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
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
    description: 'token del dispositivo del usuario generado por firebase',
    example:
      'dCbT0jbLxJNbdF2nsnnoPn:APA91bGN-tDFzGrb9GiY3HpbWDAK4p2aIGJqrYeCwcCN9uN16eHYt5CVsG0ATHlq9Ap4xDhgITdA7FsKh3RrMlUKcutCqtRzfUgawFj320CSeI6lOzBEX5M',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;
}
