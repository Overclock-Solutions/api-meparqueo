import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsNumber, IsPositive } from 'class-validator';

export class NearbyParamsDto {
  @ApiProperty({
    description: 'Latitude',
    example: 8.7554462,
  })
  @IsLatitude()
  lat: number;

  @ApiProperty({
    description: 'Longitude',
    example: -75.8889753,
  })
  @IsLongitude()
  lng: number;

  @ApiProperty({
    description: 'Radius in kilometers',
    example: 1,
  })
  @IsPositive()
  @IsNumber()
  radiusKm: number;
}
