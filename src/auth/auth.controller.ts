import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/user/user.dto';
import { ChangePasswordDto } from 'src/user/change-password.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthResponse } from '../common/types/auth';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { UserService } from 'src/user/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  /**
   * Endpoint to handle user signup.
   * @param createUserDto - Data Transfer Object containing user registration details.
   * @returns Newly created user information along with a JWT token.
   */
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  async signup(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    const user = await this.authService.registerUser(createUserDto);
    return this.authService.buildAuthResponse(user);
  }

  /**
   * Endpoint to handle user login.
   * @param loginUserDto - Data Transfer Object containing user login credentials.
   * @returns User information and a JWT token if credentials are valid.
   */
  @Post('login')
  @ApiOperation({ summary: 'Log in an existing user' })
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponse> {
    const user = await this.authService.authenticateUser(loginUserDto);
    return this.authService.buildAuthResponse(user);
  }

  @UseGuards(AuthenticationGuard)
  @Put('change-password')
  @ApiOperation({ summary: 'Change the password ' })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ) {
    return this.userService.changePassword(
      req.userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }
}
