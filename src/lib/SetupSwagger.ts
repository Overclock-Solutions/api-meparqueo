import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Parqueaderos LoRa API')
    .setDescription('API para la gestión de parqueaderos usando LoRa')
    .setVersion('1.0')
    .addTag('parqueaderos')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/v1/docs', app, document);
}
