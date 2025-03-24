import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Service } from 'src/service';
import { CreateUserDto } from './dto/create-user.dto';
import { GlobalStatus, Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService extends Service {
  constructor() {
    super(UserService.name);
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const person = await tx.person.create({
        data: {
          names: dto.names,
          lastNames: dto.lastNames,
          email: dto.email,
          phone: dto.phone,
          globalStatus: GlobalStatus[dto.globalStatus],
        },
      });

      return tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          role: Role[dto.role],
          personId: person.id,
          globalStatus: GlobalStatus[dto.globalStatus],
        },
        include: {
          person: true,
        },
      });
    });
  }

  async find() {
    return this.prisma.user.findMany({
      include: {
        person: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { person: true },
    });
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: {
          email: dto.email,
          role: Role[dto.role],
          globalStatus: GlobalStatus[dto.globalStatus],
        },
        include: { person: true },
      });

      await tx.person.update({
        where: { id: user.personId },
        data: {
          names: dto.names,
          lastNames: dto.lastNames,
          email: dto.email,
          phone: dto.phone,
          globalStatus: GlobalStatus[dto.globalStatus],
        },
      });

      return tx.user.findUnique({
        where: { id },
        include: { person: true },
      });
    });
  }

  async deleteUser(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.delete({
        where: { id },
        include: { person: true },
      });

      await tx.person.delete({
        where: { id: user.person.id },
      });

      return user;
    });
  }

  async changePassword(id: string, dto: UpdateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
      include: {
        person: true,
      },
    });
  }
}
