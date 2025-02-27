import { GlobalStatus, Version } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNodeDto {
  @IsString()
  @IsNotEmpty()
  readonly code: string;

  @IsEnum(Version)
  readonly version: Version;

  @IsEnum(GlobalStatus)
  @IsOptional()
  readonly globalStatus?: GlobalStatus;
}
