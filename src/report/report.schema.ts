import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ExcelType } from 'src/common/excel_type.enum';

@Schema()
export class Transaction extends Document {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  client_id: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ExcelType })
  type: ExcelType;
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
