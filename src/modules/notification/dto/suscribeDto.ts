import { IsEnum, IsNotEmpty } from 'class-validator';
import { Topic } from './topic-notification.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SubscribeDto {
  @ApiProperty({
    description: 'topic firebase notification',
    enum: ['SURVEY', 'REMEMBER_REPORT', 'ADS'],
    example: 'SURVEY',
  })
  @IsNotEmpty()
  @IsEnum(Topic)
  topic: Topic;
}
