import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma.service';
import {
  Prisma,
  ParkingLot,
  ParkingLotStatus,
  ParkingLotAvailability,
  GlobalStatus,
} from '@prisma/client';
import { Service } from 'src/service';

@Injectable()
export class ParkingLotService extends Service {
  constructor(private prisma: PrismaService) {
    super(ParkingLotService.name);
  }

  // Crear un nuevo parqueadero
  async create(data: Prisma.ParkingLotCreateInput): Promise<ParkingLot> {
    return await this.prisma.parkingLot.create({ data });
  }

  // Obtener todos los parqueaderos (para admin)
  async findAll(): Promise<ParkingLot[]> {
    return await this.prisma.parkingLot.findMany({
      where: { globalStatus: GlobalStatus.ACTIVE },
    });
  }

  // Obtener un parqueadero por ID
  async findOne(id: string): Promise<ParkingLot> {
    return await this.prisma.parkingLot.findUnique({
      where: { id },
    });
  }

  // Actualizar un parqueadero
  async update(
    id: string,
    data: Prisma.ParkingLotUpdateInput,
  ): Promise<ParkingLot> {
    return this.prisma.parkingLot.update({ where: { id }, data });
  }

  // Obtener el historial de actualizaciones de un parqueadero
  async getHistory(parkingLotId: string) {
    return await this.prisma.parkingLotHistory.findMany({
      where: { parkingLotId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // Actualizar estado y disponibilidad y guardar historial
  async updateEstatus(
    code: string,
    data: { status?: ParkingLotStatus; availability?: ParkingLotAvailability },
  ): Promise<ParkingLot> {
    // Actualizar el parqueadero
    const updated = await this.prisma.parkingLot.update({
      where: { code },
      data: {
        status: data.status,
        availability: data.availability,
      },
    });

    // Registrar en historial
    await this.prisma.parkingLotHistory.create({
      data: {
        parkingLotId: updated.id,
        status: data.status ?? updated.status,
        availability: data.availability ?? updated.availability,
      },
    });

    this.logger.debug(
      `Updated parking lot ${code} status: ${data.status} and availability: ${data.availability}`,
    );

    return updated;
  }

  // Eliminar un parqueadero
  async remove(id: string) {
    return await this.prisma.parkingLot.update({
      where: { id },
      data: { globalStatus: GlobalStatus.DELETED },
    });
  }

  async findNearby(lat: number, lng: number, radiusKm: number) {
    // Validar el radio
    if (radiusKm <= 0) {
      throw new Error('Invalid radius');
    }

    // 1. Calcular el cuadro delimitador (optimizado)
    const earthRadiusKm = 6371;
    const deltaLat = radiusKm / 111.2; // 1 grado ≈ 111.2 km
    const deltaLng = radiusKm / (111.2 * Math.cos((lat * Math.PI) / 180));

    // 2. Filtrar candidatos dentro del cuadro delimitador
    const candidates = await this.prisma.parkingLot.findMany({
      where: {
        latitude: {
          gte: lat - deltaLat,
          lte: lat + deltaLat,
        },
        longitude: {
          gte: lng - deltaLng,
          lte: lng + deltaLng,
        },
        availability: {
          not: ParkingLotAvailability.NO_AVAILABILITY,
        },
      },
    });

    // 3. Filtrar con Haversine para obtener resultados precisos
    const nearbyParkings = candidates.filter((parkingLot) => {
      const R = earthRadiusKm;
      const dLat = (parkingLot.latitude - lat) * (Math.PI / 180);
      const dLng = (parkingLot.longitude - lng) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat * (Math.PI / 180)) *
          Math.cos(parkingLot.latitude * (Math.PI / 180)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance <= radiusKm;
    });

    return nearbyParkings;
  }
}
