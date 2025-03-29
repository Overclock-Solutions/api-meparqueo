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

    // Obtener todos los parqueaderos (sin filtrar por estado)
    const allParkings = await this.prisma.parkingLot.findMany();

    // Calcular distancias para cada parqueadero
    const distances = await Promise.all(
      allParkings.map(async (parking) => {
        const distance = await this.mapsService.getDistance(
          lat,
          lng,
          parking.latitude,
          parking.longitude,
          DistanceMode.WALKING,
        );
        return { parking, distance };
      }),
    );

    // Filtrar parqueaderos dentro del radio
    let nearbyParkings = distances
      .filter(({ distance }) => distance <= radiusKm)
      .map(({ parking, distance }) => ({
        ...parking,
        imageUrls: (parking.images as { url: string }[]).map(
          (image) => image.url,
        ),
        distanceKm: Math.round(distance * 10) / 10,
      }));

    // Aplicar filtros opcionales
    if (filters) {
      // Filtrar por disponibilidad
      if (filters.availability && filters.availability.length > 0) {
        nearbyParkings = nearbyParkings.filter((parking) =>
          filters.availability!.includes(parking.availability),
        );
      }
      // Filtrar por precio mínimo
      if (filters.priceMin !== undefined) {
        nearbyParkings = nearbyParkings.filter(
          (parking) => parking.price >= filters.priceMin!,
        );
      }
      // Filtrar por precio máximo
      if (filters.priceMax !== undefined) {
        nearbyParkings = nearbyParkings.filter(
          (parking) => parking.price <= filters.priceMax!,
        );
      }
      // Filtrar por servicios
      if (filters.services && filters.services.length > 0) {
        nearbyParkings = nearbyParkings.filter((parking) => {
          const parkingServices = parking.services || [];
          return filters.services!.every((service) =>
            parkingServices.includes(service),
          );
        });
      }
      // Filtrar por métodos de pago
      if (filters.paymentMethods && filters.paymentMethods.length > 0) {
        nearbyParkings = nearbyParkings.filter((parking) => {
          const parkingPayments = parking.paymentMethods || [];
          return filters.paymentMethods!.every((method) =>
            parkingPayments.includes(method),
          );
        });
      }
    }

    // Ordenar parqueaderos: primero por disponibilidad y distancia
    const availabilityOrder: { [key in ParkingLotAvailability]: number } = {
      MORE_THAN_FIVE: 0,
      LESS_THAN_FIVE: 1,
      NO_AVAILABILITY: 2,
    };

    nearbyParkings.sort((a, b) => {
      const availComp =
        availabilityOrder[a.availability] - availabilityOrder[b.availability];
      if (availComp !== 0) return availComp;

      return a.distanceKm - b.distanceKm;
    });

    return nearbyParkings;
  }
}
