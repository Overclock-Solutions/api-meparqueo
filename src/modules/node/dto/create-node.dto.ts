import { ApiProperty } from '@nestjs/swagger';
import { GlobalStatus, Version } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNodeDto {
  @ApiProperty({
    description: 'codigo único del nodo',
    example: 'N-0001',
  })
  @IsString()
  @IsNotEmpty()
  readonly code: string;

  @ApiProperty({
    description: 'vesión del nodo',
    example: 'BETA',
  })
  @IsEnum(Version)
  readonly version: Version;

  @ApiProperty({
    description: 'Estado global del nodo',
    example: 'ACTIVE',
    required: false,
  })
  @IsEnum(GlobalStatus)
  @IsOptional()
  readonly globalStatus?: GlobalStatus;
}
