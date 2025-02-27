import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @ApiExcludeEndpoint()
  getHome(): string {
    return 'Bienvenido a la API de Parqueaderos LoRa, para más información visita la documentación en /docs';
  }
}
