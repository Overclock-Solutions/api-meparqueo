import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DestinationLocation } from './destination-location';

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
  distanceMt: number;
}
