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

  @Get('sponsors')
  getSponsors() {
    return {
      sponsors: [
        {
          name: 'TechNova Corp',
          image:
            'https://placehold.co/200x100/0D6EFD/FFFFFF.png?text=TechNova&font=roboto',
        },
        {
          name: 'GreenPath Solutions',
          image:
            'https://placehold.co/200x100/198754/FFFFFF.png?text=GreenPath&font=raleway',
        },
        {
          name: 'EcoDrive Ltd.',
          image:
            'https://placehold.co/200x100/20C997/FFFFFF.png?text=EcoDrive&font=montserrat',
        },
        {
          name: 'UrbanFlow Inc.',
          image:
            'https://placehold.co/200x100/6610F2/FFFFFF.png?text=UrbanFlow&font=playfair+display',
        },
        {
          name: 'SolarEdge Partners',
          image:
            'https://placehold.co/200x100/FFC107/000000.png?text=SolarEdge&font=oswald',
        },
        {
          name: 'NextMove Mobility',
          image:
            'https://placehold.co/200x100/DC3545/FFFFFF.png?text=NextMove&font=source+sans+pro',
        },
        {
          name: 'LoopCharge Tech',
          image:
            'https://placehold.co/200x100/0DCAF0/000000.png?text=LoopCharge&font=pt+sans',
        },
        {
          name: 'SmartGrid Co.',
          image:
            'https://placehold.co/200x100/6C757D/FFFFFF.png?text=SmartGrid&font=poppins',
        },
        {
          name: 'ParkLogic Systems',
          image:
            'https://placehold.co/200x100/212529/FFFFFF.png?text=ParkLogic&font=lato',
        },
      ],
    };
  }
}
