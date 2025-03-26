import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { DestinationLocation } from './destination-location';
import { Type } from 'class-transformer';

export class CreateUserSearchDto {
  @ApiProperty({ type: Object, required: false })
  @IsObject()
  @IsOptional()
  filters?: Record<string, any>;

  @ApiProperty()
  @ValidateNested()
  @Type(() => DestinationLocation)
  destinationLocation: DestinationLocation;
}
