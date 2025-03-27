import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DestinationLocation {
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
