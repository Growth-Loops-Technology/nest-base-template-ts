import { Controller, Get } from '@nestjs/common';
import { FetchDataService } from './fetchData.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guards/roles.decorator';

@ApiTags('Syncdata') // Groups endpoints under the "Auth" tag in Swagger
@Controller('sync-data')
export class FetchDataController {
  constructor(private readonly fetchDataService: FetchDataService) {}

  @Public()
  @Get('sync')
  async fetchAllData() {
    await this.fetchDataService.fetchAndStoreAllData();
    return 'All data fetched and stored successfully!';
  }
}
