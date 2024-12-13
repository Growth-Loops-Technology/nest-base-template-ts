// auth/dto/auth.response.ts
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    example: 'user@example.com',
    description: "The user's email address",
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: "The user's name or role",
  })
  name: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;
}
