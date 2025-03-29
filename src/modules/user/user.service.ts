import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Service } from 'src/service';
import { CreateUserDto } from './dto/create-user.dto';
import { GlobalStatus, Role, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserSearchDto } from './dto/create-user-search.dto';
import { CreateRecentlyParkedDto } from './dto/create-recently-parked.dto';
import { CreateUserLocationDto } from './dto/create-user-location.dto';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class UserService extends Service {
  constructor() {
    super(UserService.name);
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const person = await tx.person.create({
        data: {
          names: dto.names,
          lastNames: dto.lastNames,
          email: dto.email,
          phone: dto.phone,
          globalStatus: GlobalStatus[dto.globalStatus],
        },
      });

      return tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          role: Role[dto.role],
          personId: person.id,
          globalStatus: GlobalStatus[dto.globalStatus],
        },
        include: {
          person: true,
        },
      });
    });
  }

  async find() {
    return this.prisma.user.findMany({
      include: {
        person: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { person: true },
    });
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: {
          email: dto.email,
          role: Role[dto.role],
          globalStatus: GlobalStatus[dto.globalStatus],
        },
        include: { person: true },
      });

      await tx.person.update({
        where: { id: user.personId },
        data: {
          names: dto.names,
          lastNames: dto.lastNames,
          email: dto.email,
          phone: dto.phone,
          globalStatus: GlobalStatus[dto.globalStatus],
        },
      });

      return tx.user.findUnique({
        where: { id },
        include: { person: true },
      });
    });
  }

  async deleteUser(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.delete({
        where: { id },
        include: { person: true },
      });

      await tx.person.delete({
        where: { id: user.person.id },
      });

      return user;
    });
  }

  async changePassword(id: string, dto: UpdateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
      include: {
        person: true,
      },
    });
  }

  async createReport(dto: CreateReportDto) {
    return this.prisma.report.create({
      data: {
        reason: dto.reason,
        comment: dto.comment,
        status: dto.status || 'PENDING',
        userId: dto.userId,
        parkingLotId: dto.parkingLotId,
      },
    });
  }

  async createUserLocation(dto: CreateUserLocationDto, user: User) {
    return this.prisma.userLocation.create({
      data: {
        latitude: dto.latitude,
        longitude: dto.longitude,
        userId: user.id,
      },
    });
  }

  async createRecentlyParked(dto: CreateRecentlyParkedDto, user: User) {
    return this.prisma.recentlyParkingLot.create({
      data: {
        userId: user.id,
        parkingLotId: dto.parkingLotId,
        distanceKm: dto.distanceKm,
        destinationLocation: {
          searchTerm: dto.destinationLocation.searchTerm,
          longitude: dto.destinationLocation.longitude,
          latitude: dto.destinationLocation.latitude,
        },
        viewedAt: new Date(),
      },
    });
  }

  async createUserSearch(dto: CreateUserSearchDto, user: User) {
    return this.prisma.userSearch.create({
      data: {
        filters: dto.filters,
        destinationLocation: {
          latitude: dto.destinationLocation.latitude,
          longitude: dto.destinationLocation.longitude,
          searchTerm: dto.destinationLocation.searchTerm,
        },
        userId: user.id,
      },
    });
  }

  async getRecentlyParked(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const results = await this.prisma.recentlyParkingLot.findMany({
      where: { userId },
      include: {
        parkingLot: true,
      },
      orderBy: {
        viewedAt: 'desc',
      },
    });

    const uniqueParkingLots = new Map();
    results.forEach((item) => {
      if (!uniqueParkingLots.has(item.parkingLotId)) {
        uniqueParkingLots.set(item.parkingLotId, item);
      }
    });

    const uniqueResults = Array.from(uniqueParkingLots.values());
    const paginatedResults = uniqueResults.slice(skip, skip + limit);

    const total = uniqueResults.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: paginatedResults.map((item) => ({
        id: item.id,
        viewedAt: item.viewedAt,
        parkingLot: {
          ...item.parkingLot,
          imageUrls: (item.parkingLot.images as { url: string }[]).map(
            (image) => image.url,
          ),
        },
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}
