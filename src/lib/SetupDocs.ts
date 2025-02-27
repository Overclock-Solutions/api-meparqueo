import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  StoplightElements,
  StoplightElementsOptions,
} from './StoplightElements';

export function setupDocs(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Parqueaderos LoRa API')
    .setDescription('API para la gestión de parqueaderos usando LoRa')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs-swagger', app, document);

  const stoplightOptions: StoplightElementsOptions = {
    layout: 'sidebar',
    router: 'history',
    title: 'Parqueaderos LoRa API',
    hideInternal: false,
    hideTryIt: false,
  };

  const stoplightElements = new StoplightElements(
    app,
    document,
    stoplightOptions,
  );
  stoplightElements.setup('/docs', '/docs-swagger-json');
}
