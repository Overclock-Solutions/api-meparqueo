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

@Injectable()
export class ParkingLotService extends Service {
  constructor(private readonly globalGateway: GlobalGateway) {
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
    return await this.prisma.parkingLotHistory.findMany({
      where: { parkingLotId },
      orderBy: { updatedAt: 'asc' },
      take: 10,
    });
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

  private getDistanceKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLng = this.degreesToRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async findNearby(
    lat: number,
    lng: number,
    radiusKm: number,
  ): Promise<(ParkingLot & { imageUrls: string[]; distanceKm: number })[]> {
    this.logger?.debug(
      `Buscando parqueaderos cercanos para lat: ${lat}, lng: ${lng}, radio: ${radiusKm} km`,
    );

    // Se obtienen todos los parqueaderos abiertos
    const allParkings = await this.prisma.parkingLot.findMany({
      where: { status: ParkingLotStatus.OPEN },
    });

    // Filtrar parqueaderos dentro del radio definido
    const nearbyParkings = allParkings.filter((parking) => {
      const distance = this.getDistanceKm(
        lat,
        lng,
        parking.latitude,
        parking.longitude,
      );
      return distance <= radiusKm;
    });

    // Formatear cada parqueadero con sus URLs de imagen y la distancia calculada
    const formattedParkings = nearbyParkings.map((parking) => {
      const distanceKm = this.getDistanceKm(
        lat,
        lng,
        parking.latitude,
        parking.longitude,
      );
      return {
        ...parking,
        imageUrls: (parking.images as { url: string }[]).map(
          (image) => image.url,
        ),
        distanceKm: Math.round(distanceKm * 10) / 10,
      };
    });

    // Definir el orden de disponibilidad:
    // "MORE_THAN_FIVE" es la mejor disponibilidad, seguido de "LESS_THAN_FIVE" y finalmente "NO_AVAILABILITY"
    const availabilityOrder: { [key in ParkingLotAvailability]: number } = {
      MORE_THAN_FIVE: 0,
      LESS_THAN_FIVE: 1,
      NO_AVAILABILITY: 2,
    };

    // Ordenar: primero por disponibilidad, luego por precio (ascendente) y finalmente por distancia (más cercano primero)
    formattedParkings.sort((a, b) => {
      const availComp =
        availabilityOrder[a.availability] - availabilityOrder[b.availability];
      if (availComp !== 0) return availComp;

      const priceComp = a.price - b.price;
      if (priceComp !== 0) return priceComp;

      return a.distanceKm - b.distanceKm;
    });

    return formattedParkings;
  }
}
