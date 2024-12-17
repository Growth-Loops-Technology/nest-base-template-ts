import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Option, Question } from './survey_qs.schema';
import { CreateQuestionDto } from './survey.qs.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
    @InjectModel(Option.name) private optionModel: Model<Option>,
  ) {}

  // Create a Question with Options
  async create(
    createQuestionDto: CreateQuestionDto,
    userId: string,
  ): Promise<Question> {
    const { qs_title, qs_type, options } = createQuestionDto;

    // Create options if provided
    const optionDocuments = [];
    if (options && options.length > 0) {
      for (const optionDto of options) {
        const option = await this.optionModel.create({
          optionTitle: optionDto.option,
          isTerminalQs: optionDto.is_terminate || false,
        });
        optionDocuments.push(option._id);
      }
    }

    // Create the question
    const question = new this.questionModel({
      questionId: undefined, // UUID will be auto-generated
      qsTitle: qs_title,
      qsType: qs_type,
      options: optionDocuments.length > 0 ? optionDocuments : [],
      user: userId, // User reference ID
    });

    return question.save();
  }

  // Fetch all Questions
  async findAll(): Promise<Question[]> {
    return this.questionModel
      .find()
      .populate('options')
      .populate('user')
      .exec();
  }

  // Fetch Question by ID
  async findById(questionId: string) {
    return this.questionModel
      .findOne({ questionId })
      .populate('options')
      .populate('user')
      .exec();
  }

  // Update a Question
  async update(
    id: string,
    updateQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    return this.questionModel
      .findByIdAndUpdate(id, updateQuestionDto, { new: true })
      .exec();
  }

  // Delete a Question
  async delete(questionId: string) {
    return this.questionModel.findOneAndDelete({ questionId }).exec();
  }
}
