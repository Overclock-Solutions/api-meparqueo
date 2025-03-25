import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    required: false,
    description: 'Contraseña del usuario',
    type: 'string',
    example: '123456',
  })
  @IsString()
  @IsOptional()
  password?: string;
}
