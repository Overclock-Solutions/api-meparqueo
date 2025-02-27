import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export class NearbyParamsDto {
  @ApiProperty({
    description: 'Latitude',
    example: 8.7554462,
  })
  @IsLatitude()
  @IsNotEmpty()
  lat: number;

  @ApiProperty({
    description: 'Longitude',
    example: -75.8889753,
  })
  @IsLongitude()
  @IsNotEmpty()
  lng: number;

  @ApiProperty({
    description: 'Radius in kilometers',
    example: 1,
  })
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  radiusKm: number;
}
