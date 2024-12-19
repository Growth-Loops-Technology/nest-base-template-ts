import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ExcelType } from 'src/enums/excel_type.enum';

export class UploadExcelDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @ApiProperty({ enum: ExcelType })
  @IsEnum(ExcelType)
  type: ExcelType;
}
