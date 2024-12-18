import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QsType } from './survey_qs.schema';
import { ApiProperty } from '@nestjs/swagger';

class CreateOptionDto {
  @ApiProperty()
  @IsString()
  option: string;

  @ApiProperty()
  @IsOptional()
  is_terminate?: boolean;
}

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  qs_title: string;

  @ApiProperty()
  @IsEnum(QsType)
  qs_type: QsType;

  @IsString()
  user: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  @IsArray()
  options?: CreateOptionDto[];
}
