import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from 'src/user/user.dto';
import { User } from 'src/user/user.schema';
import { AuthResponse } from 'src/common/types/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate user credentials
  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  // Generate JWT token
  private generateToken(user: User): string {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.userType,
    };
    console.log(payload);
    return this.jwtService.sign(payload);
  }

  // Build Auth Response
  buildAuthResponse(user: User): AuthResponse {
    return {
      email: user.email,
      name: user.name,
      accessToken: this.generateToken(user),
    };
  }

  // Handle user registration
  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.registerUser(createUserDto);
  }

  // Handle user authentication
  async authenticateUser(loginUserDto: LoginUserDto): Promise<User> {
    return this.validateCredentials(loginUserDto.email, loginUserDto.password);
  }

  async googleLogin(idToken: string): Promise<User> {
    // Validate the presence of the idToken
    if (!idToken) {
      throw new BadRequestException('Token Id is required');
    }

    try {
      // Verify the Google ID token using the UserService
      const userData = await this.userService.verifyGoogleIdToken(idToken);

      // Find or create the user based on the Google data
      const user = await this.userService.findOrCreateUser(userData);
      return user;
    } catch (error) {
      // Handle any error that occurs during the process
      throw new BadRequestException('Authentication failed: ' + error.message);
    }
  }
}
