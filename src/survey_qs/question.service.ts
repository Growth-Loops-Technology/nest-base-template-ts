import { Injectable, NotFoundException } from '@nestjs/common';
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
      questionId: undefined,
      qsTitle: qs_title,
      qsType: qs_type,
      options: optionDocuments.length > 0 ? optionDocuments : [],
      user: userId,
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

  async update(
    questionId: string,
    updateQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    // First, find the question using the questionId (UUID)
    const existingQuestion = await this.questionModel
      .findOne({ questionId: questionId })
      .populate('options');

    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }

    // Check for options logic
    if (updateQuestionDto.options && updateQuestionDto.options.length > 0) {
      // If options exist in the old question, delete them
      if (existingQuestion.options && existingQuestion.options.length > 0) {
        await this.optionModel.deleteMany({
          _id: { $in: existingQuestion.options },
        });
      }

      // Create new options and link them
      const createdOptions = await this.optionModel.insertMany(
        updateQuestionDto.options.map((option) => ({
          questionId: existingQuestion.questionId,
          ...option,
        })),
      );
      updateQuestionDto.options = createdOptions.map((opt) => opt._id);
    } else {
      // If no new options are provided but old options exist, delete them
      if (existingQuestion.options && existingQuestion.options.length > 0) {
        await this.optionModel.deleteMany({
          _id: { $in: existingQuestion.options },
        });
      }
      updateQuestionDto.options = [];
    }

    // Update the question using the existing document's _id
    return this.questionModel
      .findByIdAndUpdate(existingQuestion._id, updateQuestionDto, {
        new: true,
      })
      .exec();
  }

  // Delete a Question
  async delete(questionId: string) {
    // First, find the question to ensure it exists and get its options
    const question = await this.questionModel.findOne({ questionId });

    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }

    // Delete all associated options
    if (question.options && question.options.length > 0) {
      await this.optionModel.deleteMany({
        _id: { $in: question.options },
      });
    }

    // Then delete the question itself
    return this.questionModel.findOneAndDelete({ questionId }).exec();
  }
}
