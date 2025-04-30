import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
  IsArray,
  ArrayUnique,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class NearbyParamsDto {
  @ApiProperty({ description: 'Latitude', example: 8.7554462 })
  @IsLatitude()
  @IsNotEmpty()
  lat: number;

  @ApiProperty({ description: 'Longitude', example: -75.8889753 })
  @IsLongitude()
  @IsNotEmpty()
  lng: number;

  @ApiProperty({ description: 'Radio en metros', example: 200 })
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  @Max(10000)
  radiusMt: number;

  @ApiPropertyOptional({
    description:
      'Filtrar por disponibilidad (ej.: MORE_THAN_FIVE,LESS_THAN_FIVE,NO_AVAILABILITY)',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').filter((item) => item.trim() !== '');
    }
    return value;
  })
  @IsArray()
  @ArrayUnique()
  availability?: string[];

  @ApiPropertyOptional({
    description: 'Precio mínimo',
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMin?: number;

  @ApiPropertyOptional({
    description: 'Precio máximo',
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMax?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por servicios (ej.: WIFI,SECURITY)',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').filter((item) => item.trim() !== '');
    }
    return value;
  })
  @IsArray()
  @ArrayUnique()
  services?: string[];

  @ApiPropertyOptional({
    description: 'Filtrar por métodos de pago (ej.: CREDIT_CARD,CASH)',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').filter((item) => item.trim() !== '');
    }
    return value;
  })
  @IsArray()
  @ArrayUnique()
  paymentMethods?: string[];
}
