import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new HttpException(
        {
          resCode: 'FAILED_AUTHORIZATION',
          message: '인증 기한이 만료되었습니다. 다시 시도해주세요.',
        },
        HttpStatus.OK,
      );
    }
    return user;
  }
}
