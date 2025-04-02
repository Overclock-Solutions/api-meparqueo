import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report, Role, User } from '@prisma/client';
import { Service } from 'src/service';

@Injectable()
export class ReportService extends Service {
  async create(
    createReportDto: CreateReportDto,
    user: User,
    parkingLotId: string,
  ): Promise<Report> {
    const userFind = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    const parkingLot = await this.prisma.parkingLot.findUnique({
      where: { id: parkingLotId },
    });

    if (!parkingLot) {
      throw new NotFoundException(
        'This parking with id' + user.id + ' not found',
      );
    }

    return await this.prisma.report.create({
      data: {
        reason: createReportDto.reason,
        comment: createReportDto.comment,
        status: createReportDto.reportStatus,
        userId: userFind.id,
        parkingLotId: parkingLot.id,
      },
    });
  }

  async findAllByParkingId(
    parkingLotId: string,
    page: number,
    limit: number,
    user: User,
  ) {
    const parking = await this.prisma.parkingLot.findUnique({
      where: { id: parkingLotId },
    });

    if (!parking) {
      throw new NotFoundException(
        "This parking lot doesn't exist" + parkingLotId,
      );
    }

    if (user.role === Role.OWNER && parking.ownerId !== user.id) {
      throw new UnauthorizedException("U can't access to this resource");
    }
    const totalReports = await this.prisma.report.count({
      where: { parkingLotId: parking.id },
    });

    const reports = await this.prisma.report.findMany({
      where: { parkingLotId: parking.id },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      reports,
      totalReports,
      totalPages: Math.ceil(totalReports / limit),
      currentPage: page,
    };
  }

  async findAllByUserId(user: User, page: number, limit: number) {
    const userFind = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    const totalReports = await this.prisma.report.count({
      where: { userId: userFind.id },
    });

    const reports = await this.prisma.report.findMany({
      where: { userId: userFind.id },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      reports,
      totalReports,
      totalPages: Math.ceil(totalReports / limit),
      currentPage: page,
    };
  }

  async findOne(reportId: string, user: User): Promise<Report> {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException(
        'This report with id' + reportId + " doesn't exists",
      );
    }

    if (report.userId !== user.id) {
      throw new UnauthorizedException("u can't access to this resource");
    }

    return report;
  }

  async update(
    reportId: string,
    updateReportDto: UpdateReportDto,
    user: User,
  ): Promise<Report> {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException(
        'This report with id' + reportId + " doesn't exists",
      );
    }

    if (report.userId !== user.id) {
      throw new UnauthorizedException("u can't access to this resource");
    }

    return await this.prisma.report.update({
      where: { id: report.id },
      data: {
        reason: updateReportDto.reason,
        comment: updateReportDto.comment,
        status: updateReportDto.reportStatus,
      },
    });
  }

  async remove(reportId: string, user: User): Promise<Report> {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException(
        'This report with id' + reportId + " doesn't exists",
      );
    }

    if (report.userId !== user.id) {
      throw new UnauthorizedException("u can't access to this resource");
    }

    return await this.prisma.report.delete({ where: { id: reportId } });
  }
}
