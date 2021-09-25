import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

export enum ErrorCode {
  NOT_FOUND_EMAIL = 'not_found_email',
  INVALID_USER_STATUS = 'invalid_user_status',
  INVALID_PASSWORD = 'invalid_password'
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        code: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
