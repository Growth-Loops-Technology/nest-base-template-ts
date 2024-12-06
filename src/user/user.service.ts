import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  private readonly sampleUsers = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'abc123',
    },
    {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      password: 'qwerty',
    },
  ];

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    this.insertSampleUsers();
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = new this.userModel(data);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  private async insertSampleUsers(): Promise<void> {
    for (const userData of this.sampleUsers) {
      await this.createUser(userData);
    }
  }
}
