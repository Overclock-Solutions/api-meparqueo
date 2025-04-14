import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ParkingLot,
  ParkingLotAvailability,
  ParkingLotStatus,
  Role,
} from '@prisma/client';
import { Service } from 'src/service';
import { UpdateParkingLotDto } from './dto/update-parking-lot.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreateParkingLotDto } from './dto/create-parking-lot.dto';
import { GlobalGateway } from '../common/socket/global.gateway';
import { MapsService } from '../google/maps/maps.service';
import { DistanceMode } from '../google/maps/types';
import * as dayjs from 'dayjs';

@Injectable()
export class ParkingLotService extends Service {
  constructor(
    private readonly globalGateway: GlobalGateway,
    private readonly mapsService: MapsService,
  ) {
    super(ParkingLotService.name);
  }

  private async formatParkingLot(id: string): Promise<
    ParkingLot & {
      nodeIds: string[];
      reportsCount: number;
      imageUrls: string[];
    }
  > {
    const parkingLot = await this.prisma.parkingLot.findUnique({
      where: { id },
      include: {
        owner: {
          include: { person: true },
        },
        nodes: true,
      },
    });

    if (!parkingLot) {
      throw new NotFoundException(`Parqueadero con id ${id} no encontrado`);
    }

    const oneMonthAgo = dayjs().subtract(30, 'day').toDate();

    const reportsCount = await this.prisma.report.count({
      where: {
        parkingLotId: parkingLot.id,
        createdAt: { gte: oneMonthAgo },
      },
    });

    return {
      ...parkingLot,
      imageUrls: (parkingLot.images as { url: string }[]).map(
        (image) => image.url,
      ),
      nodeIds: parkingLot.nodes.map((node) => node.id),
      reportsCount,
    };
  }

  private async formatParkingLots(
    parkingLots: ParkingLot[],
  ): Promise<(ParkingLot & { nodeIds: string[] })[]> {
    return Promise.all(parkingLots.map((lot) => this.formatParkingLot(lot.id)));
  }

  async create(
    data: CreateParkingLotDto,
  ): Promise<ParkingLot & { nodeIds: string[] }> {
    const { nodeIds, ...rest } = data;
    const createData: any = {
      ...rest,
      ...(nodeIds ? { nodes: { connect: nodeIds.map((id) => ({ id })) } } : {}),
    };

    const newParkingLot = await this.prisma.parkingLot.create({
      data: createData,
    });
    return this.formatParkingLot(newParkingLot.id);
  }

  async findAll(): Promise<(ParkingLot & { nodeIds: string[] })[]> {
    const parkingLots = await this.prisma.parkingLot.findMany({
      include: {
        owner: { include: { person: true } },
        nodes: true,
      },
    });
    return this.formatParkingLots(parkingLots);
  }

  async findOne(id: string): Promise<ParkingLot & { nodeIds: string[] }> {
    return this.formatParkingLot(id);
  }

  async update(
    id: string,
    data: UpdateParkingLotDto,
  ): Promise<ParkingLot & { nodeIds: string[] }> {
    const { nodeIds, ...rest } = data;
    const updateData: any = {
      ...rest,
      ...(nodeIds ? { nodes: { set: nodeIds.map((id) => ({ id })) } } : {}),
    };

    await this.prisma.parkingLot.update({ where: { id }, data: updateData });
    return this.formatParkingLot(id);
  }

  async getHistory(parkingLotId: string) {
    const histories = await this.prisma.parkingLotHistory.findMany({
      where: { parkingLotId },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });
    return histories.reverse();
  }

  async updateEstatus(data: UpdateStatusDto): Promise<{
    id: string;
    parkingLotId: string;
    status: ParkingLotStatus;
    availability: ParkingLotAvailability;
    updatedAt: string;
  }> {
    // Verificar existencia primero
    const existing = await this.prisma.parkingLot.findUnique({
      where: { code: data.code },
    });

    if (!existing) {
      throw new NotFoundException(
        `Parqueadero con código ${data.code} no encontrado`,
      );
    }

    await this.prisma.$transaction([
      this.prisma.parkingLot.update({
        where: { code: data.code },
        data: {
          status: data.status,
          availability: data.availability,
        },
      }),
      this.prisma.parkingLotHistory.create({
        data: {
          parkingLotId: existing.id,
          status: data.status,
          availability: data.availability,
        },
      }),
    ]);

    const newHistory = await this.prisma.parkingLotHistory.create({
      data: {
        parkingLotId: existing.id,
        status: data.status,
        availability: data.availability,
      },
    });

    this.globalGateway.emitToRole(Role.ADMIN, 'updateEstatus', newHistory);
    this.globalGateway.emitToRole(Role.USER, 'parkingUpdateStatus', newHistory);

    this.logger.debug(
      `Estado actualizado - Codigo: ${data.code} | Estado: ${data.status} | Disponibilidad: ${data.availability}`,
    );

    return {
      id: newHistory.id,
      parkingLotId: newHistory.parkingLotId,
      status: newHistory.status,
      availability: newHistory.availability,
      updatedAt: newHistory.updatedAt.toISOString(),
    };
  }

  async remove(id: string): Promise<ParkingLot & { nodeIds: string[] }> {
    const parkingLot = await this.prisma.parkingLot.delete({
      where: { id },
      include: {
        owner: {
          include: { person: true },
        },
        nodes: true,
      },
    });

    if (!parkingLot) {
      throw new NotFoundException(`Parqueadero con id ${id} no encontrado`);
    }

    return {
      ...parkingLot,
      nodeIds: parkingLot.nodes.map((node) => node.id),
    };
  }

  async findNearby(
    lat: number,
    lng: number,
    radiusKm: number,
    filters?: {
      availability?: string[];
      priceMin?: number;
      priceMax?: number;
      services?: string[];
      paymentMethods?: string[];
    },
  ): Promise<(ParkingLot & { imageUrls: string[]; distanceKm: number })[]> {
    this.logger?.debug(
      `Buscando parqueaderos cercanos para lat: ${lat}, lng: ${lng}, radio: ${radiusKm} km`,
    );

    const where: any = {};

    if (filters) {
      if (filters.availability && filters.availability.length > 0) {
        where.availability = { in: filters.availability };
      }

      if (filters.priceMin !== undefined) {
        const priceMinNumber = Number(filters.priceMin);
        where.price = { ...(where.price || {}), gte: priceMinNumber };
      }

      if (filters.priceMax !== undefined) {
        const priceMaxNumber = Number(filters.priceMax);
        where.price = { ...(where.price || {}), lte: priceMaxNumber };
      }

      if (filters.services && filters.services.length > 0) {
        where.services = {
          hasEvery: filters.services,
        };
      }

      if (filters.paymentMethods && filters.paymentMethods.length > 0) {
        where.paymentMethods = {
          hasEvery: filters.paymentMethods,
        };
      }
    }

    const latDelta = radiusKm / 111.0;
    const lngDelta = radiusKm / (111.0 * Math.cos(lat * (Math.PI / 180)));

    where.latitude = {
      gte: Number(lat) - Number(latDelta),
      lte: Number(lat) + Number(latDelta),
    };

    where.longitude = {
      gte: Number(lng) - Number(lngDelta),
      lte: Number(lng) + Number(lngDelta),
    };

    const filteredParkings = await this.prisma.parkingLot.findMany({
      where,
    });

    const parkingsWithDistance = await Promise.all(
      filteredParkings.map(async (parking) => {
        const responseMaps = await this.mapsService.getDistance(
          lat,
          lng,
          parking.latitude,
          parking.longitude,
          DistanceMode.WALKING,
        );

        const oneMonthAgo = dayjs().subtract(30, 'day').toDate();

        const reportsCount = await this.prisma.report.count({
          where: {
            parkingLotId: parking.id,
            createdAt: { gte: oneMonthAgo },
          },
        });

        return {
          ...parking,
          imageUrls: (parking.images as { url: string }[]).map(
            (image) => image.url,
          ),
          distanceKm: Math.round(responseMaps.distanceKm * 10) / 10,
          durationMin: Math.floor(responseMaps.durationMin),
          reportsCount,
        };
      }),
    );

    const nearbyParkings = parkingsWithDistance
      .filter((parking) => parking.distanceKm <= radiusKm)
      .sort((a, b) => {
        const availabilityOrder: { [key in ParkingLotAvailability]: number } = {
          MORE_THAN_FIVE: 0,
          LESS_THAN_FIVE: 1,
          NO_AVAILABILITY: 2,
        };

        const availComp =
          availabilityOrder[a.availability] - availabilityOrder[b.availability];
        if (availComp !== 0) return availComp;

        return a.distanceKm - b.distanceKm;
      });

    return nearbyParkings;
  }
}
