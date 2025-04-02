import { ReportReason, ReportStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    enum: ReportReason,
    description: 'Reason for the report',
    example: ReportReason.INCORRECT_INFO,
  })
  @IsNotEmpty()
  @IsEnum(ReportReason)
  reason: ReportReason;

  @ApiProperty({
    description: 'Comment regarding the report',
    example: 'This parking lot does not have bathrooms',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({
    enum: ReportStatus,
    required: false,
    description: 'Status of the report',
    example: ReportStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ReportStatus)
  reportStatus?: ReportStatus;
}
