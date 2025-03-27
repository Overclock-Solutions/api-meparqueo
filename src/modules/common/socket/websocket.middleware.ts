import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';

type SocketIOMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const AuthWsMiddleware = (
  jwtService: JwtService,
  configService: ConfigService,
  jwtStrategy: JwtStrategy,
): SocketIOMiddleware => {
  return async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) throw new Error('Token no proporcionado');

      const payload = await jwtService.verifyAsync(token, {
        secret: configService.get<string>('jwt.secret'),
      });

      const user = await jwtStrategy.validate(payload);
      socket.data.user = user;

      next();
    } catch {
      next(new Error('No autorizado'));
    }
  };
};
