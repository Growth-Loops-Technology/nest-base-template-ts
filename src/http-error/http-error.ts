import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponseOptions,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  BadRequestDTO,
  InternalServerErrorDTO,
  NotFoundDTO,
  UnauthorizedDTO,
} from './http-error.dto';

export function ApiOk(options: ApiResponseOptions) {
  return applyDecorators(HttpCode(HttpStatus.OK), ApiOkResponse(options));
}

export function ApiAccepted(description: string = 'Accepted') {
  return applyDecorators(
    HttpCode(HttpStatus.ACCEPTED),
    ApiAcceptedResponse({
      description,
    }),
  );
}

export function ApiBadRequest(description: string = 'Invalid Input') {
  return applyDecorators(
    HttpCode(HttpStatus.BAD_REQUEST),
    ApiBadRequestResponse({
      description,
      type: BadRequestDTO,
    }),
  );
}

export function ApiUnauthorizedRequest(description: string = 'Unauthorized') {
  return applyDecorators(
    HttpCode(HttpStatus.UNAUTHORIZED),
    ApiUnauthorizedResponse({
      description,
      type: UnauthorizedDTO,
    }),
  );
}

export function ApiNotFound(description: string = 'Not Found') {
  return applyDecorators(
    HttpCode(HttpStatus.NOT_FOUND),
    ApiNotFoundResponse({
      description,
      type: NotFoundDTO,
    }),
  );
}

export function ApiInternalServerError(
  description: string = 'Internal Server Error',
) {
  return applyDecorators(
    HttpCode(HttpStatus.INTERNAL_SERVER_ERROR),
    ApiInternalServerErrorResponse({
      description,
      type: InternalServerErrorDTO,
    }),
  );
}

export function CommonHttpErrors() {
  return applyDecorators(
    ApiBadRequest(),
    ApiUnauthorizedRequest(),
    ApiNotFound(),
    ApiInternalServerError(),
  );
}
