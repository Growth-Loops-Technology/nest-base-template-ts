import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Membership extends Document {
  @Prop({ required: true, unique: true })
  membershipId: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  clientId: string;

  @Prop({ required: true })
  locationId: string;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
