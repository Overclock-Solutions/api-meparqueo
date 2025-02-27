/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GlobalStatus, Node } from '@prisma/client';
import { Service } from 'src/service';
import { PrismaService } from 'src/core/prisma.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';

@Injectable()
export class NodeService extends Service {
  constructor(private prisma: PrismaService) {
    super(NodeService.name);
  }

  async create(data: CreateNodeDto): Promise<Node> {
    const node = await this.prisma.node.findFirst({
      where: { code: data.code, globalStatus: GlobalStatus.ACTIVE },
    });

    if (node) {
      throw new ConflictException(`El código '${data.code}' ya está en uso`);
    }

    return await this.prisma.node.create({
      data: {
        code: data.code,
        version: data.version,
      },
    });
  }

  async findAll(): Promise<Node[]> {
    const nodes = await this.prisma.node.findMany({
      where: {
        globalStatus: {
          in: [GlobalStatus.ACTIVE, GlobalStatus.INACTIVE],
        },
      },
    });

    return nodes;
  }

  async findOne(nodeId: string): Promise<Node> {
    const node = await this.prisma.node.findFirst({
      where: {
        id: nodeId,
      },
    });

    if (!node) {
      throw new NotFoundException('Nodo con id' + nodeId + ' no existe');
    }

    return node;
  }

  async update(nodeId: string, data: UpdateNodeDto): Promise<Node> {
    const node = await this.prisma.node.findFirst({
      where: { id: nodeId },
    });

    if (!node) {
      throw new NotFoundException(`Nodo con ID '${nodeId}' no existe`);
    }

    const nodeByCode = await this.prisma.node.findFirst({
      where: { code: data.code, NOT: { id: nodeId } },
    });

    if (nodeByCode) {
      throw new ConflictException(
        'No puedes actualizar a este código, porque ya está en uso',
      );
    }

    // Actualizar el nodo
    const nodeUpdated = await this.prisma.node.update({
      where: { id: nodeId }, // ✅ Solo el ID aquí
      data,
    });

    return nodeUpdated;
  }

  async remove(nodeId: string): Promise<Node> {
    const node = await this.prisma.node.findFirst({
      where: { id: nodeId },
    });
    if (!node) {
      throw new NotFoundException(`El nodo con la ID '${nodeId}' no existe`);
    }
    const nodeDeleted = await this.prisma.node.update({
      where: { id: nodeId },
      data: { globalStatus: GlobalStatus.DELETED },
    });

    return nodeDeleted;
  }
}
