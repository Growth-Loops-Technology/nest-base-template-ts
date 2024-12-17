import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './survey.qs.dto';
import { JwtAuthGuard } from 'src/auth/auth.gaurd';
import { RolesGuard } from 'src/auth/roles/roles.gaurd';
import { Roles } from 'src/auth/roles/roles.decorator';
import { UserType } from 'src/common/enum/user.enum';

@ApiTags('Questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @Post('create_qs')
  async create(@Body() createQuestionDto: CreateQuestionDto, @Req() req) {
    const userId = req.user.id;
    console.log('userId:', userId);
    return this.questionService.create(createQuestionDto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @Get('get_qs')
  async findAll() {
    return this.questionService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @Get(':questionId')
  async findById(@Param('questionId') questionId: string) {
    return this.questionService.findById(questionId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: CreateQuestionDto,
  ) {
    return this.questionService.update(id, updateQuestionDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @Delete(':questionId')
  async delete(@Param('questionId') questionId: string) {
    return this.questionService.delete(questionId);
  }
}
