import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  GlobalStatus,
  ParkingLotAvailability,
  ParkingLotStatus,
} from '@prisma/client';

export class CreateParkingLotDto {
  @IsString()
  @IsNotEmpty()
  readonly code: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsNumber()
  @Type(() => Number)
  readonly latitude: number;

  @IsNumber()
  @Type(() => Number)
  readonly longitude: number;

  @IsEnum(ParkingLotStatus)
  readonly status: ParkingLotStatus;

  @IsEnum(ParkingLotAvailability)
  readonly availability: ParkingLotAvailability;

  @IsEnum(GlobalStatus)
  @IsOptional()
  readonly globalStatus?: GlobalStatus;

  @IsString()
  @IsOptional()
  readonly ownerId?: string;

  @IsString()
  @IsOptional()
  readonly nodeId?: string;
}
