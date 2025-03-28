import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DistanceMode } from '@prisma/client';
import axios from 'axios';
@Injectable()
export class MapsService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('google.maps.apiUrl');
    this.apiKey = this.configService.get<string>('google.maps.apiKey');
  }

  public async getDistance(
    latOrigin: number,
    lngOrigin: number,
    latDestination: number,
    lngDestination: number,
    distanceMode: DistanceMode,
  ) {
    const origin = `${latOrigin},${lngOrigin}`;
    const destination = `${latDestination},${lngDestination}`;

    const mapsResponse = await axios.get(this.apiUrl, {
      params: {
        origins: origin,
        destinations: destination,
        key: this.apiKey,
        mode: distanceMode,
      },
    });
    const data = mapsResponse.data;

    if (data.status !== 'OK') {
      throw new Error(`Error en la API de Google: ${data.status}`);
    }

    const result = data.rows[0].elements[0];
    if (result.status !== 'OK') {
      throw new Error(`No se pudo calcular la distancia: ${result.status}`);
    }

    const distanceText = result.distance.text;
    const distanceNumber = parseFloat(distanceText.replace(' km', ''));
    return distanceNumber;
  }
}
