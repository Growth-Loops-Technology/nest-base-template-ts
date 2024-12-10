import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Purchase extends Document {
  @Prop({ required: true, unique: true })
  purchaseId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop()
  details?: string;

  @Prop({ required: true })
  clientId: string;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
