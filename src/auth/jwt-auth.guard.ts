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
          message: '인증에 실패하였습니다.',
        },
        HttpStatus.OK,
      );
    }
    return user;
  }
}
