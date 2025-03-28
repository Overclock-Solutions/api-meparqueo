import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export enum DistanceMode {
  WALKING,
  DRIVING,
  BICYCLING,
  TRANSIT,
}
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

  @ApiProperty({
    description: 'Distance mode',
    enum: ['WALKING', 'DRIVING', 'BICYCLING', 'TRANSIT'],
    example: 'WALKING',
  })
  @IsNotEmpty()
  @IsEnum(DistanceMode)
  distanceMode: DistanceMode;
}
