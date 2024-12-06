import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() data: Partial<User>): Promise<User> {
    return this.userService.createUser(data);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}
