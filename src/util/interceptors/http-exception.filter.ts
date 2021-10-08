import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

export enum ErrorCode {
  NOT_FOUND_EMAIL = 'not_found_email',
  INVALID_USER_STATUS = 'invalid_user_status',
  INVALID_PASSWORD = 'invalid_password',
  ALREADY_EXIST_EMAIL = 'already_exist_email',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND_TOKEN = 'NOT_FOUND_TOKEN',
  INTERNAL_SERVER_ERROR = 'internal_server_error',
  SEND_MAIL_ERROR = 'send_mail_error',
  NOT_FOUND_USER = 'not_found_user',
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json(exception.getResponse());
  }
}
