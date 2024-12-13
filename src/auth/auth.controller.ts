// auth/auth.controller.ts
import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthResponse } from './dto/auth.response';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully signed up.',
    type: AuthResponse,
  })
  async signUp(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    return this.authService.registerUser(
      createUserDto.email,
      createUserDto.password,
      createUserDto.role,
    );
  }

  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    type: AuthResponse,
  })
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponse> {
    return this.authService.loginUser(
      loginUserDto.email,
      loginUserDto.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved.',
    schema: {
      type: 'object',
      properties: { email: { type: 'string' }, role: { type: 'string' } },
    },
  })
  async getProfile(@Req() req): Promise<{ email: string; role: string }> {
    const user = await this.authService.getProfile(req.user.sub);
    return { email: user.email, role: user.role };
  }
}
