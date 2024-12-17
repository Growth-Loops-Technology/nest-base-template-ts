import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/user.schema';

export enum QsType {
  LONG_TEXT = 'long_text',
  SHORT_TEXT = 'short_text',
  MCQ = 'mcq',
  CHECKBOX = 'checkbox',
}

@Schema()
export class Option extends Document {
  @Prop({ default: uuidv4, unique: true })
  optionId: string;

  @Prop({ required: true })
  optionTitle: string;

  @Prop({ default: false })
  isTerminalQs: boolean;
}

export const OptionSchema = SchemaFactory.createForClass(Option);

@Schema()
export class Question extends Document {
  @Prop({ default: uuidv4, unique: true, required: true })
  questionId: string;

  @Prop({ required: true })
  qsTitle: string;

  @Prop({
    type: String,
    enum: QsType,
    required: true,
  })
  qsType: QsType;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Option' }] })
  options: Option[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
