import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Yaay..!! you are connected to AI Studio Manager Backend... 😊 ';
  }
}
