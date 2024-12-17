import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from 'src/user/user.dto';
import { User } from 'src/user/user.schema';
import { AuthResponse } from 'src/common/types/auth';
import { ResetToken } from '../auth/schema/reset-token.schema';
import { MailService } from '../services/mail.service';
import { InjectModel } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(ResetToken.name) private resetTokenModel: Model<ResetToken>,
    private mailService: MailService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate user credentials
  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    console.log('user ', user);

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
    return this.jwtService.sign(payload, { expiresIn: '10h' });
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
    console.log(loginUserDto.email, loginUserDto.password);
    return this.validateCredentials(loginUserDto.email, loginUserDto.password);
  }

  async forgotPassword(email: string) {
    //  Check the user exists
    const user = await this.userService.findByEmail(email);

    if (user) {
      // If user exists then generate a password link
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const resetToken = nanoid(64);
      await this.resetTokenModel.create({
        token: resetToken,
        userId: user._id,
        expiryDate,
      });

      // Send the link to the user by email

      await this.mailService.sendPasswordResetEmail(email, resetToken);
    }
    return { message: 'If this user exists, they will receive an email ' };
  }

  async resetPassword(newPassword: string, resetToken: string) {
    // Find a valid reset token document
    const token = await this.resetTokenModel.findOne({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });
    if (!token) throw new UnauthorizedException('Invalid Link');

    // change user password
    const user = await this.userService.findById(token.userId);
    if (!user) {
      throw new InternalServerErrorException();
    }
    user.password = newPassword;
    await user.save();
    return {
      message: 'Password reset successfully',
    };
  }
}
