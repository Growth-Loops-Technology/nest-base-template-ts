import { Body, Controller, Post, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/user/user.dto';
import { UserService } from '../user/user.service';
import { Public } from './guards/roles.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomException } from 'src/http-error/error-handler';
import {
  ApiOk,
  CommonHttpErrors,
  ApiAccepted,
} from 'src/http-error/http-error';

@ApiTags('Auth') // Groups endpoints under the "Auth" tag in Swagger
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
  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiAccepted('User registered successfully')
  @CommonHttpErrors()
  async signup(@Body() createUserDto: CreateUserDto) {
    // Create a new user
    const user = await this.userService.registerUser(createUserDto);

    // Generate JWT token for the new user
    const payload = { userId: user._id, email: user.email };
    const accessToken = await this.authService.createJwtToken(payload);

    // Return response with token
    return {
      email: user.email,
      name: user.name,
      accessToken,
    };
  }

  /**
   * Endpoint to handle user login.
   * @param loginUserDto - Data Transfer Object containing user login credentials.
   * @returns User information and a JWT token if credentials are valid.
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Log in an existing user' })
  @ApiOk({ description: 'User logged in successfully' })
  @CommonHttpErrors()
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // Validate user credentials
    const user = await this.authService.validateUser(email, password);
    console.log('Login Request:', loginUserDto);
    console.log('User Validated:', user);
    if (!user) {
      throw new CustomException({
        _message: 'Invalid email or password',
        _statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    // Generate JWT token for the authenticated user
    return this.authService.login(user);
  }
}
