import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  Google_loginDto,
  LoginUserDto,
} from 'src/user/user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthResponse } from '../common/types/auth';
import { UserService } from '../user/user.service';
// import { ApiBody, ApiResponse } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
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

  /**
   * Endpoint to handle Google login.
   * @param idToken - Google ID token for authentication.
   * @returns User information and a JWT token if authentication is successful.
   */
  @Post('google_login')
  @ApiOperation({ summary: 'Log in with Google' })
  async googleLogin(
    @Body() google_loginDto: Google_loginDto,
  ): Promise<AuthResponse> {
    const user = await this.authService.googleLogin(google_loginDto.id_token);
    return this.authService.buildAuthResponse(user);
  }
}
