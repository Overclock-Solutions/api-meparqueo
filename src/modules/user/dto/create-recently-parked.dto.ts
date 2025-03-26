import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class DestinationLocation {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  searchTerm: string;
}

export class CreateRecentlyParkedDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  parkingLotId: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => DestinationLocation)
  destinationLocation: DestinationLocation;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  distanceKm: number;
}
