import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Class extends Document {
  @Prop({ required: true, unique: true })
  classId: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  staffId: string;

  @Prop({ required: true })
  sessionTypeId: string;

  @Prop({ required: true })
  locationId: string;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
