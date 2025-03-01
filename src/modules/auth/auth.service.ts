import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Service } from 'src/service';
import { RegisterOwnerDto } from './dto/registerOwner.dto';

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

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async getMe(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async createOwner(dto: RegisterOwnerDto) {
    const person = await this.prisma.person.create({
      data: {
        names: dto.names,
        lastNames: dto.lastnames,
        email: dto.email,
        phone: dto.phone,
      },
    });

    if (!person) {
      throw new ConflictException('El email ya está en uso');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: Role.OWNER,
        personId: person.id,
      },
    });
  }
}
