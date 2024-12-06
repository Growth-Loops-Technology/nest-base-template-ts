import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }
  
  async generateToken(payload: { userId: string; email: string }): Promise<string> {
    return this.jwtService.sign(payload);
  }  

  async login(user: any) {
    const payload = { userId: user.userId, email: user.email };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '48h' }),
    };
  }
}