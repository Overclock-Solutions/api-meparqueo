import { Injectable, ConflictException } from '@nestjs/common';
import {
  Prisma,
  ParkingLot,
  GlobalStatus,
  ParkingLotStatus,
} from '@prisma/client';
import { Service } from 'src/service';
import { UpdateParkingLotDto } from './dto/update-parking-lot.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class ParkingLotService extends Service {
  constructor() {
    super(ParkingLotService.name);
  }

  // Crear un nuevo parqueadero
  async create(data: Prisma.ParkingLotCreateInput): Promise<ParkingLot> {
    const existing = await this.prisma.parkingLot.findFirst({
      where: { code: data.code },
    });

    if (existing) {
      throw new ConflictException(
        `Parking lot with code ${data.code} already exists`,
      );
    }

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
  async update(id: string, data: UpdateParkingLotDto): Promise<ParkingLot> {
    const updateParking = await this.prisma.parkingLot.findUnique({
      where: { id },
    });

    if (!updateParking) {
      throw new ConflictException(`Parking lot with id ${id} does not exist`);
    }

    const existing = await this.prisma.parkingLot.findFirst({
      where: { code: data.code, NOT: { id } },
    });

    if (existing) {
      throw new ConflictException(
        `Parking lot with code ${data.code} already exists`,
      );
    }

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
    data: UpdateStatusDto,
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
    // TODO: Implementar lógica para buscar parqueaderos cercanos
    this.logger.debug(
      `Finding nearby parking lots for lat: ${lat}, lng: ${lng}, radius: ${radiusKm} km`,
    );
    const nearbyParkings = await this.prisma.parkingLot.findMany({
      where: {
        status: ParkingLotStatus.OPEN,
      },
    });

    return nearbyParkings;
  }
}
