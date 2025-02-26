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
  })
  @IsString()
  @IsNotEmpty({
    message: 'El codigo es obligatrio',
  })
  readonly code: string;

  @ApiProperty({
    description: 'El nombre del parqueadero es obligatorio',
    type: String,
  })
  @IsString()
  @IsNotEmpty({
    message: 'El nombre es obligatorio',
  })
  readonly name: string;

  @ApiProperty({
    description: 'La direccion es obligatoria',
    type: String,
  })
  @IsString()
  @IsNotEmpty({
    message: 'La direcciones obligatoria',
  })
  readonly address: string;

  @ApiProperty({
    description: 'Latitud del parqueadero',
    type: Number,
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
  })
  @IsNumber()
  @IsNotEmpty({
    message: 'La longitud es obligatoria',
  })
  @Type(() => Number)
  readonly longitude: number;

  @ApiProperty({
    description: 'Estado del parqueadero',
  })
  @IsEnum(ParkingLotStatus)
  readonly status: ParkingLotStatus;

  @ApiProperty({
    description: 'Disponiblidad del parqueadero',
  })
  @IsEnum(ParkingLotAvailability)
  readonly availability: ParkingLotAvailability;

  @ApiProperty({
    description: 'Estado global del parqueadero',
  })
  @IsEnum(GlobalStatus)
  @IsOptional()
  readonly globalStatus?: GlobalStatus;

  @ApiProperty({
    description: 'Id del dueño',
    type: String,
  })
  @IsString()
  @IsOptional()
  readonly ownerId?: string;
}
