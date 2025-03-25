import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateUserSearchDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  searchTerm: string;

  @ApiProperty({ type: Object, required: false })
  @IsObject()
  @IsOptional()
  filters?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  longitude?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
}
