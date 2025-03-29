import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum Topic {
  SURVEY,
  REMEMBER_REPORT,
  ADS,
}
export class TopicNotificationDto extends PickType(CreateNotificationDto, [
  'title',
  'body',
  'icon',
]) {
  @ApiProperty({
    description: 'Distance mode',
    enum: ['SURVEY', 'REMEMBER_REPORT', 'ADS'],
    example: 'SURVEY',
  })
  @IsEnum(Topic)
  @IsNotEmpty()
  topic: Topic;
}
