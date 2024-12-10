import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Program extends Document {
  @Prop({ required: true, unique: true })
  programId: string;

  @Prop({ required: true })
  name: string;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
