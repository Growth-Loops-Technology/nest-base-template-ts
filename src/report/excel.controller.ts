import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExcelService } from './excel.service';
import { UploadExcelDto } from './excel_dto';
import { JwtAuthGuard } from 'src/auth/auth.gaurd';
import { RolesGuard } from 'src/auth/roles/roles.gaurd';
import { UserType } from 'src/common/enum/user.enum';
import { Roles } from 'src/auth/roles/roles.decorator';

@ApiTags('Excel')
@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload excel file and process data' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Returns total amount' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadExcelDto,
  ): Promise<{ totalAmount: number }> {
    const totalAmount = await this.excelService.processExcelFile(
      file,
      dto.type,
    );
    return { totalAmount };
  }
}
