import { IsNotEmpty, IsString } from 'class-validator';

export class ClientDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;
}
