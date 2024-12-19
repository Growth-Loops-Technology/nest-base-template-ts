import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as XLSX from 'xlsx';
import { Transaction } from './report.schema';
import { ExcelType } from 'src/common/excel_type.enum';
import * as moment from 'moment';

@Injectable()
export class ExcelService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
  ) {}

  async processExcelFile(
    file: Express.Multer.File,
    type: ExcelType,
  ): Promise<number> {
    const workbook = XLSX.read(file.buffer); // Update this line
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet); // Update this line

    const mappedData = this.mapDataByType(jsonData, type);
    await this.transactionModel.insertMany(mappedData);

    const totalAmount = mappedData.reduce((sum, item) => sum + item.amount, 0);
    return totalAmount;
  }

  private mapDataByType(data: any[], type: ExcelType): Partial<Transaction>[] {
    switch (type) {
      case ExcelType.HUMANA:
        return data.map((row) => ({
          date: new Date(row.CommRunDt),
          client_id: row.GrpNbr,
          amount: parseFloat(row.PaidAmount),
          type,
        }));

      case ExcelType.SELECT_HEALTH:
        return data.map((row) => {
          const coverageDate = row['COVERAGE EFFECTIVE'];
          if (!coverageDate) {
            throw new Error(
              `Missing "COVERAGE EFFECTIVE" field in row: ${JSON.stringify(row)}`,
            );
          }

          const parsedDate = moment(coverageDate.trim(), 'MM/YYYY').toDate();
          if (isNaN(parsedDate.getTime())) {
            throw new Error(
              `Invalid date format in "COVERAGE EFFECTIVE": ${coverageDate}`,
            );
          }

          const parsedAmount = parseFloat(row.AMOUNT);
          if (isNaN(parsedAmount)) {
            throw new Error(`Invalid amount value: ${row.AMOUNT}`);
          }

          const clientId = row['SUBSCRIBER ID'];
          if (!clientId) {
            throw new Error('Client ID is required');
          }

          return {
            date: parsedDate,
            client_id: clientId,
            amount: parsedAmount,
            type,
          };
        });

      default:
        throw new Error('Unsupported Excel type');
    }
  }
}
