import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SessionType extends Document {
  @Prop({ required: true, unique: true })
  sessionTypeId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  locationId: string;

  @Prop({ required: true })
  staffId: string;
}

export const SessionTypeSchema = SchemaFactory.createForClass(SessionType);
