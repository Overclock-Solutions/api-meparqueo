import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
export class GlobalGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(GlobalGateway.name);
  private activeUsers = new Map<string, string>();

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
      const user = client.data.user;
      if (!user) throw new Error('Usuario no autenticado');

      const role: Role = user.role || 'guest';

      client.join(role);
      this.activeUsers.set(client.id, user.id);

      this.logger.log(
        `✅ Cliente ${client.id} conectado como ${role} | Usuario: ${user.id}`,
      );

      // Emitir evento de conexión
      this.server.emit('user_connected', { userId: user.id, role });
    } catch (error) {
      this.logger.warn(`❌ Conexión rechazada: ${error.message}`);
      client.emit('error', { message: 'No autorizado' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.activeUsers.get(client.id);
    this.activeUsers.delete(client.id);

    this.logger.log(
      `🔴 Cliente desconectado: ${client.id} | Usuario: ${userId ?? 'desconocido'}`,
    );

    // Emitir evento de desconexión
    if (userId) {
      this.server.emit('user_disconnected', { userId });
    }
  }

  emitToRole(role: Role, event: string, payload: any) {
    if (!role) {
      this.logger.warn(`⚠️ Intento de emitir evento a un rol inválido`);
      return;
    }
    this.server.to(role).emit(event, payload);
  }

  emitToUser(socketId: string, event: string, payload: any) {
    if (!this.activeUsers.has(socketId)) {
      this.logger.warn(
        `⚠️ Intento de emitir a socket desconocido: ${socketId}`,
      );
      return;
    }
    this.server.to(socketId).emit(event, payload);
  }
}
