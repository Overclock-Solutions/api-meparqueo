import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({
    description: 'Calificación del 1 al 5',
    example: '4',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Comentario opcional de la calificación',
    example: 'Excelente servicio',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'Id del usuario que realiza la calificación',
    example: 'aa222aa4-b001-47fb-ad09-07b2e20bbca1',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Id del parqueadero a la que se realiza la calificación',
    example: 'aa222aa4-b001-47fb-ad09-07b2e20bbca1',
  })
  @IsNotEmpty()
  @IsString()
  parkingLotId: string;
}
