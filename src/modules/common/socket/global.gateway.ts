import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthWsMiddleware } from './websocket.middleware';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
})
export class GlobalGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(GlobalGateway.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  afterInit() {
    this.server.use(
      AuthWsMiddleware(this.jwtService, this.configService, this.jwtStrategy),
    );
  }

  async handleConnection(client: Socket) {
    try {
      if (!client.data.user) throw new Error('Usuario no autenticado');

      const role = client.data.user.role || 'guest';
      client.join(role);

      this.logger.debug(
        `Cliente ${client.id} autenticado como ${role} | Usuario: ${client.data.user.id}`,
      );
    } catch (error) {
      this.logger.error(`Error de conexión: ${error.message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(
      `Cliente desconectado: ${client.id} | Usuario: ${client.data.user?.sub}`,
    );
  }
  emitToRole(role: Role, event: string, payload: any) {
    this.server.to(role).emit(event, payload);
  }

  emitToUser(socketId: string, event: string, payload: any) {
    this.server.to(socketId).emit(event, payload);
  }
}
