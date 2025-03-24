import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Service } from 'src/service';

@Injectable()
export class AuthService extends Service {
  constructor(private jwtService: JwtService) {
    super(AuthService.name);
  }

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: Role.USER,
      },
    });

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      globalStatus: user.globalStatus,
    };

    return {
      token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async getMe(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: { person: true },
    });
  }

  async clientAuth(clientId: string) {
    const clientEmail = `${clientId}@meparqueo.com`;
    let user = await this.prisma.user.findUnique({
      where: { email: clientEmail },
    });

    if (!user) {
      const randomPassword = await this.randomPass();
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await this.prisma.user.create({
        data: {
          email: clientEmail,
          password: hashedPassword,
          role: Role.USER,
        },
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      globalStatus: user.globalStatus,
    };

    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  randomPass = async (): Promise<string> => {
    return Math.random().toString(36).slice(-8);
  };
}
