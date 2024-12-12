import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all users',
    type: [User],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access. Please provide valid credentials.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
}
