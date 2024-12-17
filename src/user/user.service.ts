import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from '../auth/dto/user.dto';
import { ResetToken } from './reset-token.schema';
import { MailService } from '../services/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(ResetToken.name) private resetTokenModel: Model<ResetToken>,
    private mailService: MailService,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
  // This method checks if a user exists based on their email
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  // Creates a new user and ensures email uniqueness
  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const newUser = new this.userModel({
      ...createUserDto,
    });
    return newUser.save();
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    // find the user
    const loggedinUser = await this.userModel
      .findById(userId)
      .select('+password');

    if (!loggedinUser) {
      throw new NotFoundException('User not Found...');
    }

    // compare the old password with the new password in DB
    const passwordMatch = await bcrypt.compare(
      oldPassword,
      loggedinUser.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // change user password
    // const newHashedPassword = await bcrypt.hash(newPassword, 10);
    loggedinUser.password = newPassword;
    await loggedinUser.save();

    return {
      userId: loggedinUser._id,
      email: loggedinUser.email,
    };
  }

  async forgotPassword(email: string) {
    //  Check the user exists
    const user = await this.userModel.findOne({ email });

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
      return { message: 'Email sent successfully' };
    }
    throw new NotFoundException('User not found');
  }

  async resetPassword(newPassword: string, resetToken: string) {
    // Find a valid reset token document
    const token = await this.resetTokenModel.findOne({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });
    if (!token) throw new UnauthorizedException('Invalid Link');

    // change user password
    const user = await this.userModel.findById(token.userId);
    if (!user) {
      throw new InternalServerErrorException();
    }
    user.password = newPassword;
    await user.save();
    return {
      message: 'Password reset successfully',
    };
  }
  async getAllUsers(): Promise<User[]> {
    const users = this.userModel.find();
    return users;
  }
}
