// webhook-payload.dto.ts
import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsObject,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ParkingLotAvailability, ParkingLotStatus } from '@prisma/client';

class DecodedPayloadDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(ParkingLotStatus)
  @IsNotEmpty()
  status: ParkingLotStatus;

  @IsEnum(ParkingLotAvailability)
  @IsNotEmpty()
  availability: ParkingLotAvailability;
}

class UplinkMessageDto {
  @IsObject()
  @ValidateNested()
  @Type(() => DecodedPayloadDto)
  decoded_payload: DecodedPayloadDto;
}

export class WebhookPayloadDto {
  @IsObject()
  @ValidateNested()
  @Type(() => UplinkMessageDto)
  uplink_message: UplinkMessageDto;
}
