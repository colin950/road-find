import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CommonResponse<T> {
  resCode: string;
  message: string;
  data: T;
}

@Injectable()
export class CommonResponseInterceptor<T>
  implements NestInterceptor<T, CommonResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CommonResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        resCode: data.resCode,
        message: data.message,
        data: data.data,
      })),
    );
  }
}
