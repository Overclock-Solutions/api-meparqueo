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
import { ApiProperty } from '@nestjs/swagger';

export class CreateParkingLotDto {
  @ApiProperty({
    description: 'Codigo del parqueadero',
    type: String,
    example: 'P001',
  })
  @IsString()
  @IsNotEmpty({
    message: 'El codigo es obligatrio',
  })
  readonly code: string;

  @ApiProperty({
    description: 'El nombre del parqueadero es obligatorio',
    type: String,
    example: 'Parqueadero',
  })
  @IsString()
  @IsNotEmpty({
    message: 'El nombre es obligatorio',
  })
  readonly name: string;

  @ApiProperty({
    description: 'Direccion del parqueadero',
    type: String,
    example: 'Calle 27 &, Av. 1, Montería',
  })
  @IsString()
  @IsNotEmpty({
    message: 'La direcciones obligatoria',
  })
  readonly address: string;

  @ApiProperty({
    description: 'Latitud del parqueadero',
    type: Number,
    example: 8.7554462,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty({
    message: 'La latitud es obligatoria',
  })
  readonly latitude: number;

  @ApiProperty({
    description: 'La longitud es obligatoria',
    type: Number,
    example: -75.8889753,
  })
  @IsNumber()
  @IsNotEmpty({
    message: 'La longitud es obligatoria',
  })
  @Type(() => Number)
  readonly longitude: number;

  @ApiProperty({
    description: 'Estado del parqueadero',
    example: 'OPEN',
  })
  @IsEnum(ParkingLotStatus)
  readonly status: ParkingLotStatus;

  @ApiProperty({
    description: 'Disponiblidad del parqueadero',
    example: 'MORE_THAN_FIVE',
  })
  @IsEnum(ParkingLotAvailability)
  readonly availability: ParkingLotAvailability;

  @ApiProperty({
    description: 'Estado global',
    enum: GlobalStatus,
    enumName: 'GlobalStatus',
    required: false,
    example: 'ACTIVE',
  })
  @IsEnum(GlobalStatus)
  @IsOptional()
  readonly globalStatus?: GlobalStatus;

  @ApiProperty({
    description: 'Id del dueño',
    type: String,
    example: '5e21e6b8-61dc-4936-85ca-b77dc72359c6',
  })
  @IsString()
  @IsOptional()
  readonly ownerId?: string;
}
