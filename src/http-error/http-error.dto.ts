import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class BadRequestDTO {
  @ApiProperty()
  error: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true }) // Ensure each element in the array is a string
  message: string[];

  @ApiProperty({ default: 400 })
  statusCode: number;
}

export class InternalServerErrorDTO {
  @ApiProperty()
  error: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ default: 500 })
  statusCode: number;
}

export class NotFoundDTO {
  @ApiProperty()
  error: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ default: 404 })
  statusCode: number;
}

export class UnauthorizedDTO {
  @ApiProperty()
  error: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ default: 401 })
  statusCode: number;
}
