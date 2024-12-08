import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
// import { User } from './user.schema';
// import { CreateUserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // async createUser(@Body() data: CreateUserDto): Promise<User> {
  //   return this.userService.createUser(data);
  // }

  // @Get()
  // async getAllUsers(): Promise<User[]> {
  //   return null;
  // }
}
