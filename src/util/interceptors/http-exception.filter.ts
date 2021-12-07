import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

export enum ErrorCode {
  NOT_FOUND_EMAIL = '존재하지 않는 이메일입니다. ',
  INVALID_PASSWORD = '아이디 또는 비밀번호가 잘못 입력 되었습니다.',
  ALREADY_EXIST_EMAIL = '이미 가입된 이메일입니다.',
  NOT_FOUND_TOKEN = '인증 번호가 일치하지 않습니다. ',
  INTERNAL_SERVER_ERROR = 'internal_server_error',
  SEND_MAIL_ERROR = '메일 보내기에 실패하였습니다. 다시 시도해주세요.',
  NOT_FOUND_USER = '유저 정보를 조회할 수 없습니다.',
  NOT_FOUND_PLACE = '요청으로 들어온 주소 정보가 없습니다.',
  ALREADY_EXIST_NICKNAME = '이미 사용중인 닉네임입니다.',
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
