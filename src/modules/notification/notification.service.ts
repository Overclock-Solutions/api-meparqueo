import { Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { TopicNotificationDto } from './dto/topic-notification.dto';
import { Service } from 'src/service';
import { SubscribeDto } from './dto/suscribeDto';
import { User } from '@prisma/client';
@Injectable()
export class NotificationService extends Service {
  async sendNotification(createNotificationDto: CreateNotificationDto) {
    //console.log('createNotificationDto recibido:', createNotificationDto);

    const user = await this.prisma.user.findUnique({
      where: { id: createNotificationDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        'user with id ' + createNotificationDto.userId,
      );
    }

    if (!user.deviceId) {
      throw new NotFoundException(
        `user with id ${createNotificationDto.userId} does not have a device id`,
      );
    }

    const deviceId = user.deviceId;
    try {
      const response = await admin.messaging().send({
        token: deviceId,
        webpush: {
          notification: {
            title: createNotificationDto.title,
            body: createNotificationDto.body,
            icon: createNotificationDto.icon,
          },
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async sendTopicNotification(TopicNotificationDto: TopicNotificationDto) {
    const message = {
      notification: {
        title: TopicNotificationDto.title,
        body: TopicNotificationDto.body,
      },
      webpush: {
        notification: {
          icon: TopicNotificationDto.icon,
        },
      },
      topic: TopicNotificationDto.topic.toString(),
    };

    try {
      const response = await admin.messaging().send(message);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async subscribeToTopic(subscribeDto: SubscribeDto, user: User) {
    const userFind = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userFind) {
      throw new NotFoundException('user with id ' + user.id);
    }

    if (!userFind.deviceId) {
      throw new NotFoundException(
        `user with id ${user.id} does not have a device id`,
      );
    }

    const deviceId = userFind.deviceId;

    try {
      const response = await admin
        .messaging()
        .subscribeToTopic(deviceId, subscribeDto.topic.toString());
      return response;
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      throw error;
    }
  }
}
