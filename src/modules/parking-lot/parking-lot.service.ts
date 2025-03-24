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
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });
  }

  async updateEstatus(
    data: UpdateStatusDto,
  ): Promise<ParkingLot & { nodeIds: string[] }> {
    const updated = await this.prisma.parkingLot.update({
      where: { code: data.code },
      data: { status: data.status, availability: data.availability },
    });

    await this.prisma.parkingLotHistory.create({
      data: {
        parkingLotId: updated.id,
        status: data.status ?? updated.status,
        availability: data.availability ?? updated.availability,
      },
    });

    this.logger.debug(
      `Parqueadero ${data.code} actualizado: estado ${data.status} y disponibilidad ${data.availability}`,
    );

    return this.formatParkingLot(updated.id);
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
  ): Promise<(ParkingLot & { nodeIds: string[] })[]> {
    this.logger.debug(
      `Buscando parqueaderos cercanos para lat: ${lat}, lng: ${lng}, radio: ${radiusKm} km`,
    );

    const nearbyParkings = await this.prisma.parkingLot.findMany({
      where: { status: ParkingLotStatus.OPEN },
      include: {
        owner: { include: { person: true } },
        nodes: true,
      },
    });

    return this.formatParkingLots(nearbyParkings);
  }
}
