// auth.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './dto/auth.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(
    email: string,
    password: string,
    role: string,
  ): Promise<AuthResponse> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, role },
    });

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      email: user.email,
      name: user.role,
      accessToken,
    };
  }

  async loginUser(email: string, password: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      email: user.email,
      name: user.role,
      accessToken,
    };
  }

  async getProfile(userId: string) {
    console.log('Received userId:', userId);
    if (!userId) {
      throw new Error('Invalid userId');
    }
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
