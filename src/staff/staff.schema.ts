import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Staff extends Document {
  @Prop({ required: true, unique: true })
  staffId: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  displayName?: string;

  @Prop()
  bio?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ required: true })
  empId: string;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
