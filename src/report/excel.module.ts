import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { TransactionSchema, Transaction } from './report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}
