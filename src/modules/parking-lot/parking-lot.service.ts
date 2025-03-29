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
import { MapsService } from './maps/maps.service';
import { DistanceMode } from './dto/nearby-param.dto';

@Injectable()
export class ParkingLotService extends Service {
  constructor(
    private readonly globalGateway: GlobalGateway,
    private readonly mapsService: MapsService,
  ) {
    super(ParkingLotService.name);
  }

  private async formatParkingLot(
    id: string,
  ): Promise<ParkingLot & { nodeIds: string[] }> {
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

    return {
      ...parkingLot,
      nodeIds: parkingLot.nodes.map((node) => node.id),
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

  private degreesToRadians(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async findNearby(
    lat: number,
    lng: number,
    radiusKm: number,
    distanceMode: DistanceMode,
  ): Promise<(ParkingLot & { imageUrls: string[]; distanceKm: number })[]> {
    this.logger?.debug(
      `Buscando parqueaderos cercanos para lat: ${lat}, lng: ${lng}, radio: ${radiusKm} km`,
    );

    // Obtener todos los parqueaderos abiertos
    const allParkings = await this.prisma.parkingLot.findMany({
      where: { status: ParkingLotStatus.OPEN },
    });

    // Obtener distancias usando Google Maps API
    const distances = await Promise.all(
      allParkings.map(async (parking) => {
        const distance = await this.mapsService.getDistance(
          lat,
          lng,
          parking.latitude,
          parking.longitude,
          distanceMode,
        );
        return { parking, distance };
      }),
    );

    // Filtrar parqueaderos dentro del radio
    const nearbyParkings = distances
      .filter(({ distance }) => distance <= radiusKm)
      .map(({ parking, distance }) => ({
        ...parking,
        imageUrls: (parking.images as { url: string }[]).map(
          (image) => image.url,
        ),
        distanceKm: Math.round(distance * 10) / 10,
      }));

    // Ordenar parqueaderos
    const availabilityOrder: { [key in ParkingLotAvailability]: number } = {
      MORE_THAN_FIVE: 0,
      LESS_THAN_FIVE: 1,
      NO_AVAILABILITY: 2,
    };

    nearbyParkings.sort((a, b) => {
      const availComp =
        availabilityOrder[a.availability] - availabilityOrder[b.availability];
      if (availComp !== 0) return availComp;

      const priceComp = a.price - b.price;
      if (priceComp !== 0) return priceComp;

      return a.distanceKm - b.distanceKm;
    });

    return nearbyParkings;
  }
}
