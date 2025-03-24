import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ParkingLotAvailability, ParkingLotStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Código único del parqueadero',
    example: 'P001',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Estado operativo del parqueadero',
    enum: ParkingLotStatus,
    example: ParkingLotStatus.OPEN,
    required: true,
  })
  @IsEnum(ParkingLotStatus)
  @IsNotEmpty()
  status: ParkingLotStatus;

  @ApiProperty({
    description: 'Nivel de disponibilidad de espacios',
    enum: ParkingLotAvailability,
    example: ParkingLotAvailability.MORE_THAN_FIVE,
    required: true,
  })
  @IsEnum(ParkingLotAvailability)
  @IsNotEmpty()
  availability: ParkingLotAvailability;
}
