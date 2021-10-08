import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// 유저 정보를 가져오는 데코레이터입니다.
// `@Req() req` 대신 사용하세요.
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user;
  },
);
