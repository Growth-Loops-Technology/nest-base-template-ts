import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/user/user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthResponse } from '../common/types/auth';
import { UserService } from '../user/user.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
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
  @ApiBody({
    description: 'Google ID token for authentication',
    schema: {
      type: 'object',
      properties: {
        id_token: {
          type: 'string',
          description: 'The Google ID token',
          example: 'your-google-id-token',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful Google login',
    schema: {
      example: {
        success: true,
        message: 'Login successful',
        data: {
          userId: '12345abcde',
          email: 'user@example.com',
          name: 'John Doe',
          accessToken: 'your-jwt-token',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or missing Google ID token',
    schema: {
      example: {
        success: false,
        message: 'Authentication failed',
        error: 'Invalid ID token',
      },
    },
  })
  async googleLogin(@Body('id_token') idToken: string) {
    if (!idToken) {
      return { success: false, message: 'id_token is required' };
    }

    try {
      const userData = await this.userService.verifyGoogleIdToken(idToken);
      const user = await this.userService.findOrCreateUser(userData);
      const accessToken = this.authService.generateToken(user);

      return {
        success: true,
        message: 'Login successful',
        data: {
          userId: user._id,
          email: user.email,
          name: user.name,
          accessToken,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Authentication failed',
        error: error.message,
      };
    }
  }
}
