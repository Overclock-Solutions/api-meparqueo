import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Service } from 'src/service';
import { GlobalStatus, User } from '@prisma/client';

@Injectable()
export class RatingService extends Service {
  async createOrUpdateRating(dto: CreateRatingDto, user: User) {
    if (user.id !== dto.userId) {
      throw new ConflictException(
        'No puedes crear este recurso en nombre de otro',
      );
    }
    const rating = await this.prisma.rating.upsert({
      where: {
        userId_parkingLotId: {
          userId: dto.userId,
          parkingLotId: dto.parkingLotId,
        },
      },
      update: {
        rating: dto.rating,
        comment: dto.comment,
        globalStatus: GlobalStatus.ACTIVE,
      },
      create: {
        userId: dto.userId,
        parkingLotId: dto.parkingLotId,
        rating: dto.rating,
        comment: dto.comment,
        globalStatus: GlobalStatus.ACTIVE,
      },
    });

    await this.updateParkingLotRating(dto.parkingLotId);

    return rating;
  }

  async findAllByParkingId(parkingLotId: string, page: number, limit: number) {
    const parking = this.prisma.parkingLot.findUnique({
      where: { id: parkingLotId },
    });

    if (!parking) {
      throw new NotFoundException(
        'El parqueadero con la id' + parkingLotId + 'no existe',
      );
    }

    const skip = (page - 1) * limit;
    const ratings = await this.prisma.rating.findMany({
      where: { parkingLotId: parkingLotId },
      skip,
      take: limit,
    });

    const total = await this.prisma.rating.count({
      where: {
        parkingLotId,
      },
    });

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      ratings,
    };
  }

  async findOne(ratingId: string) {
    const rating = await this.prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new NotFoundException(
        `La calificación con ID ${ratingId} no existe.`,
      );
    }

    return rating;
  }

  async remove(userId: string, ratingId: string, user: User) {
    if (userId !== user.id) {
      throw new ConflictException('No puedes acceder a este recurso');
    }
    const rating = await this.prisma.rating.findUnique({
      where: { id: ratingId },
      select: { userId: true },
    });

    if (!rating) {
      throw new NotFoundException(
        `La calificación con ID ${ratingId} no existe.`,
      );
    }

    if (rating.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar esta calificación.',
      );
    }

    const ratingDeleted = await this.prisma.rating.delete({
      where: { id: ratingId },
    });

    await this.updateParkingLotRating(ratingDeleted.parkingLotId);
    return ratingDeleted;
  }

  async updateParkingLotRating(parkingLotId: string) {
    const avgRating = await this.prisma.rating.aggregate({
      where: { parkingLotId },
      _avg: { rating: true },
    });

    await this.prisma.parkingLot.update({
      where: { id: parkingLotId },
      data: { averageRating: avgRating._avg.rating ?? 0 },
    });
  }
}
