import { HttpException } from '@nestjs/common';

interface IError {
  _message: any;
  _statusCode: any;
}

export class CustomException extends HttpException {
  constructor(params: IError) {
    super(params._message, params._statusCode);
  }
}
