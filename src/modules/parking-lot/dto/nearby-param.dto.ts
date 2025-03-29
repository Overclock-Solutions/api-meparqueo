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
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class NearbyParamsDto {
  @ApiProperty({ description: 'Latitude', example: 8.7554462 })
  @IsLatitude()
  @IsNotEmpty()
  lat: number;

  @ApiProperty({ description: 'Longitude', example: -75.8889753 })
  @IsLongitude()
  @IsNotEmpty()
  lng: number;

  @ApiProperty({ description: 'Radio en kilómetros', example: 10 })
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  radiusKm: number;

  @ApiPropertyOptional({
    description:
      'Filtrar por disponibilidad (ej.: MORE_THAN_FIVE,LESS_THAN_FIVE,NO_AVAILABILITY)',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
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
    description: 'Filtrar por servicios (ej.: ["WIFI", "SECURITY"])',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  services?: string[];

  @ApiPropertyOptional({
    description: 'Filtrar por métodos de pago (ej.: ["CREDIT_CARD", "CASH"])',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  paymentMethods?: string[];
}
