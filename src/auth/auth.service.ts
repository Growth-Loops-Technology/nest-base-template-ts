import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from 'src/user/user.dto';
import { User } from 'src/user/user.schema';
import { AuthResponse } from 'src/common/types/auth';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const { password: originalPassword, ...result } = user.toObject();
    const isValidMatch = await bcrypt.compare(password, originalPassword);
    if (isValidMatch) {
      return result;
    }
    throw new UnauthorizedException('Invalid email or password');
  }

  generateToken(user: User): string {
    const payload = { userId: user._id, email: user.email };
    return this.jwtService.sign(payload);
  }
  async handleSignUp(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const user = await this.userService.createUser(createUserDto);

    const accessToken = this.generateToken(user);
    return {
      email: user.email,
      name: user.name,
      accessToken,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponse> {
    const { email, password } = loginUserDto;

    const user = await this.validateUser(email, password);
    const accessToken = this.generateToken(user);
    return {
      email: user.email,
      name: user.name,
      accessToken,
    };
  }
}
