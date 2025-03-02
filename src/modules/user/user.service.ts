import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Service } from 'src/service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService extends Service {
  constructor() {
    super(UserService.name);
  }

  async create(dto: CreateUserDto) {
    const person = await this.prisma.person.create({
      data: {
        names: dto.names,
        lastNames: dto.lastnames,
        email: dto.email,
        phone: dto.phone,
      },
    });

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: Role[dto.role],
        personId: person.id,
      },
      include: {
        person: true,
      },
    });
  }

  async find() {
    return await this.prisma.user.findMany({
      include: {
        person: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { person: true },
    });
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email,
        role: Role[dto.role],
      },
      include: {
        person: true,
      },
    });

    return await this.prisma.person.update({
      where: { id: user.personId },
      data: {
        names: dto.names,
        lastNames: dto.lastnames,
        email: dto.email,
        phone: dto.phone,
      },
      include: {
        user: true,
      },
    });
  }

  async deleteUser(id: string) {
    const userDeleted = await this.prisma.user.delete({
      where: { id },
    });

    await this.prisma.person.delete({
      where: { id: userDeleted.personId },
    });
  }

  async changePassword(id: string, dto: UpdateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return await this.prisma.user.update({
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
