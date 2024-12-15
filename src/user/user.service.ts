import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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

  async getAllUsers(): Promise<User[]> {
    const users = this.userModel.find();
    return users;
  }
}
