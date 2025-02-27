import { IsLatitude, IsLongitude, IsNumber, IsPositive } from 'class-validator';

export class NearbyParamsDto {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;

  @IsPositive()
  @IsNumber()
  radiusKm: number;
}
