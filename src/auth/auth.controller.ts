import { Body, Controller, Post, UseGuards, Request, ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/user/user.dto';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { Public } from './guards/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    // Check if a user with the same email already exists
    const existingUser = await this.userService.findUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Create a new user
    const user = await this.userService.createUser(createUserDto);

    // Generate JWT token for the new user
    const payload = { userId: user._id, email: user.email };
    const accessToken = await this.authService.generateToken(payload);

    // Return response with token
    return {
      email: user.email,
      name: user.name,
      accessToken,
    };
  }

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // Validate user credentials
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token for the authenticated user
    return this.authService.login(user);
  }
}
