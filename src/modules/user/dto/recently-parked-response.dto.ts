import { ApiProperty } from '@nestjs/swagger';
import { ParkingLot } from '@prisma/client';

export class RecentlyParkedResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  viewedAt: Date;

  @ApiProperty()
  parkingLot: ParkingLot;
}

export class PaginationDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

export class PaginatedRecentlyParkedResponseDto {
  @ApiProperty({ type: [RecentlyParkedResponseDto] })
  data: RecentlyParkedResponseDto[];

  @ApiProperty()
  pagination: PaginationDto;
}
