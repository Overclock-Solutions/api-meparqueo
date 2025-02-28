import { Injectable, NotFoundException } from '@nestjs/common';
import { ParkingLot, ParkingLotStatus } from '@prisma/client';
import { Service } from 'src/service';
import { UpdateParkingLotDto } from './dto/update-parking-lot.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreateParkingLotDto } from './dto/create-parking-lot.dto';

@Injectable()
export class ParkingLotService extends Service {
  constructor() {
    super(ParkingLotService.name);
  }

  async create(data: CreateParkingLotDto): Promise<ParkingLot> {
    const { nodeIds, ...rest } = data;
    const createData: any = {
      ...rest,
      ...(nodeIds ? { nodes: { connect: nodeIds.map((id) => ({ id })) } } : {}),
    };

    return await this.prisma.parkingLot.create({ data: createData });
  }

  async findAll(): Promise<ParkingLot[]> {
    return await this.prisma.parkingLot.findMany();
  }

  async findOne(id: string): Promise<ParkingLot> {
    const parkingLot = await this.prisma.parkingLot.findUnique({
      where: { id },
    });
    if (!parkingLot) {
      throw new NotFoundException(`Parqueadero con id ${id} no encontrado`);
    }
    return parkingLot;
  }

  async update(id: string, data: UpdateParkingLotDto): Promise<ParkingLot> {
    const { nodeIds, ...rest } = data;
    const updateData: any = {
      ...rest,
      ...(nodeIds ? { nodes: { set: nodeIds.map((id) => ({ id })) } } : {}),
    };

    return await this.prisma.parkingLot.update({
      where: { id },
      data: updateData,
    });
  }

  async getHistory(parkingLotId: string) {
    return await this.prisma.parkingLotHistory.findMany({
      where: { parkingLotId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async updateEstatus(
    code: string,
    data: UpdateStatusDto,
  ): Promise<ParkingLot> {
    const updated = await this.prisma.parkingLot.update({
      where: { code },
      data: {
        status: data.status,
        availability: data.availability,
      },
    });

    await this.prisma.parkingLotHistory.create({
      data: {
        parkingLotId: updated.id,
        status: data.status ?? updated.status,
        availability: data.availability ?? updated.availability,
      },
    });

    this.logger.debug(
      `Parqueadero ${code} actualizado: estado ${data.status} y disponibilidad ${data.availability}`,
    );

    return updated;
  }

  async remove(id: string): Promise<ParkingLot> {
    return await this.prisma.parkingLot.delete({
      where: { id },
    });
  }

  // TODO: hacer una buena logica
  async findNearby(
    lat: number,
    lng: number,
    radiusKm: number,
  ): Promise<ParkingLot[]> {
    this.logger.debug(
      `Buscando parqueaderos cercanos para lat: ${lat}, lng: ${lng}, radio: ${radiusKm} km`,
    );
    const nearbyParkings = await this.prisma.parkingLot.findMany({
      where: { status: ParkingLotStatus.OPEN },
    });

    return nearbyParkings;
  }
}
