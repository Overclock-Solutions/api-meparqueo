import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  ApiBody,
  ApiExtraModels,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TopicNotificationDto } from './dto/topic-notification.dto';
import { SubscribeDto } from './dto/suscribeDto';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role, User } from '@prisma/client';
import { RESPONSE_LOGIN_401 } from '../auth/docs/responses';
import {
  RESPONSE_SEND_TOPIC_NOTIFICATION_200,
  RESPONSE_SEND_TOPIC_NOTIFICATION_400,
  RESPONSE_SUSCRIBE_TOPIC_201,
  RESPONSE_SUSCRIBE_TOPIC_404,
  RESPONSE_SUSCRIBE_TOPIC_500,
} from './docs/notificationResponses';
import { ActiveUser } from '../auth/decorators/session.decorator';

@ApiTags('Notification')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token',
})
@ApiResponse({
  status: 401,
  description: 'No autorizado',
  example: RESPONSE_LOGIN_401,
})
@ApiExtraModels(TopicNotificationDto, SubscribeDto)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send-topic-notification')
  @ApiOperation({ summary: 'Send a push notification to a topic' })
  @ApiBody({ type: TopicNotificationDto })
  @ApiResponse({
    status: 200,
    example: RESPONSE_SEND_TOPIC_NOTIFICATION_200,
  })
  @ApiResponse({
    status: 400,
    example: RESPONSE_SEND_TOPIC_NOTIFICATION_400,
  })
  @Auth([Role.ADMIN])
  @ResponseMessage('Topic notification sent successfully')
  async sendTopicNotification(
    @Body() topicNotificationDto: TopicNotificationDto,
  ) {
    return this.notificationService.sendTopicNotification(topicNotificationDto);
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe a user to a topic' })
  @ApiBody({ type: SubscribeDto })
  @ApiResponse({
    status: 201,
    example: RESPONSE_SUSCRIBE_TOPIC_201,
  })
  @ApiResponse({
    status: 400,
    example: RESPONSE_SEND_TOPIC_NOTIFICATION_400,
  })
  @ApiResponse({
    status: 500,
    example: RESPONSE_SUSCRIBE_TOPIC_500,
  })
  @ApiResponse({
    status: 404,
    example: RESPONSE_SUSCRIBE_TOPIC_404,
  })
  @ResponseMessage('User subscribed to topic successfully')
  @Auth([Role.USER])
  async subscribeToTopic(
    @Body() subscribeDto: SubscribeDto,
    @ActiveUser() user: User,
  ) {
    return this.notificationService.subscribeToTopic(subscribeDto, user);
  }
}
