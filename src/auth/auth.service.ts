import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      try {
        // Direct comparison using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: pwd, ...result } = user.toObject();
          return result;
        }
      } catch (error) {
        console.error('Authentication Error:', {
          message: error.message,
          stack: error.stack,
        });
      }
    }
    return null;
  }

  // Generate a JWT token with a payload containing user ID and email
  async createJwtToken(
    payload: { userId: string; email: string },
    expiresIn: string = '48h',
  ): Promise<string> {
    return this.jwtService.sign(payload, {
      expiresIn,
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  // Handles login response with an access token
  async login(user: any) {
    const payload = { userId: user.userId, email: user.email };
    return {
      access_token: await this.createJwtToken(payload),
      user: {
        id: payload.userId,
        email: payload.email,
      },
    };
  }
}
