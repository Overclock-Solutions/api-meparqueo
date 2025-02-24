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
    return this.prisma.parkingLot.create({ data });
  }

  // Obtener todos los parqueaderos (para admin)
  async findAll(): Promise<ParkingLot[]> {
    return this.prisma.parkingLot.findMany({
      where: { globalStatus: GlobalStatus.ACTIVE },
      include: { histories: true },
    });
  }

  // Obtener un parqueadero por ID
  async findOne(id: string): Promise<ParkingLot> {
    return this.prisma.parkingLot.findUnique({
      where: { id },
      include: { histories: true },
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
    return this.prisma.parkingLotHistory.findMany({
      where: { parkingLotId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // Actualizar estado y disponibilidad y guardar historial
  async updateEstatusAndAvailability(
    parkingLotId: string,
    data: { status?: ParkingLotStatus; availability?: ParkingLotAvailability },
  ): Promise<ParkingLot> {
    // Actualizar el parqueadero
    const updated = await this.prisma.parkingLot.update({
      where: { id: parkingLotId },
      data: {
        status: data.status,
        availability: data.availability,
      },
    });

    // Registrar en historial
    await this.prisma.parkingLotHistory.create({
      data: {
        parkingLotId,
        status: data.status ?? updated.status,
        availability: data.availability ?? updated.availability,
      },
    });

    return updated;
  }

  // Eliminar un parqueadero
  async remove(id: string) {
    return this.prisma.parkingLot.update({
      where: { id },
      data: { globalStatus: GlobalStatus.DELETED },
    });
  }
}
