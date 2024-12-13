import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.gaurd';
import { RolesGuard } from 'src/auth/roles/roles.gaurd';
import { Roles } from 'src/auth/roles/roles.decorator';
import { UserType } from 'src/common/enum/user.enum';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
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
