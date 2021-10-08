import { Users } from 'src/entities/users.entity';
import { BaseEntity } from 'typeorm';

// passport에 정의되어 있는 req.user에 해당하는 User type을
// 우리가 사용하는 user 타입과 일치시킵니다.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends AuthUser {}
  }
}

export type AuthUser = Omit<Users, keyof BaseEntity | 'password'>;

export interface JwtPayload {
  email: string;
  sub: number;
}
