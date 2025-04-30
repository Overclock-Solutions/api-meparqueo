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

  @ApiProperty({
    description: 'Ids de los nodos',
    type: [String],
    example: ['312883d9-cab7-4f22-b6c4-aeae51737ace'],
    isArray: true,
  })
  @IsString({ each: true })
  @IsOptional()
  readonly nodeIds?: string[];

  @ApiProperty({
    description: 'Precio del parqueadero',
    type: Number,
    example: 2400,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty({
    message: 'El precio es obligatorio',
  })
  readonly price: number;

  @ApiProperty({
    description: 'Precio por día para motocicleta',
    type: Number,
    example: 8000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly priceMotorcyclePerDay?: number;

  @ApiProperty({
    description: 'Precio por día para carro',
    type: Number,
    example: 12000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly priceCarPerDay?: number;

  @ApiProperty({
    description: 'Precio por hora para carro',
    type: Number,
    example: 3000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly priceCarPerHour?: number;

  @ApiProperty({
    description: 'Precio por hora para motocicleta',
    type: Number,
    example: 1500,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly priceMotorcyclePerHour?: number;

  @ApiProperty({
    description: 'Número de teléfono del parqueadero',
    type: String,
    example: '3116347710',
  })
  @IsString()
  @IsOptional()
  readonly phoneNumber: string;

  @ApiProperty({
    description: 'Tipos de vehículos aceptados',
    type: [String],
    example: ['CAR', 'MOTORCYCLE', 'BICYCLE'],
    isArray: true,
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true, message: 'El tipo de vehículo es obligatorio' })
  readonly acceptedVehicleTypes: string[];

  @ApiProperty({
    description: 'Nivel de comodidad del parqueadero (1 a 5)',
    type: Number,
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty({ message: 'La comodidad es obligatoria' })
  readonly comfort: number;

  @ApiProperty({
    description: 'Imágenes del parqueadero',
    example: [
      {
        key: '01',
        url: 'https://res.cloudinary.com/dxuauzyp9/image/upload/v1742793169/meparqueo/paisaje.jpg',
      },
    ],
    isArray: true,
  })
  @IsOptional()
  readonly images?: { key: string; url: string }[];

  @ApiProperty({
    description: 'Descripción del parqueadero',
    type: String,
    example: 'Parqueadero en el centro de Montería',
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    description: 'Métodos de pago aceptados',
    type: [String],
    example: ['nequi', 'daviplata'],
    isArray: true,
  })
  @IsString({ each: true })
  @IsOptional()
  readonly paymentMethods?: string[];

  @ApiProperty({
    description: 'Servicios ofrecidos en el parqueadero',
    type: [String],
    example: ['lavado', 'bar'],
    isArray: true,
  })
  @IsString({ each: true })
  @IsOptional()
  readonly services?: string[];
}
