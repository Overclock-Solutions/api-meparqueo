import { IsEnum } from 'class-validator';
import { ParkingLotAvailability, ParkingLotStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Codigo del parqueadero',
    example: 'P001',
  })
  readonly code: string;

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
}
