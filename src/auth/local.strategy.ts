import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ErrorCode } from '../util/interceptors/http-exception.filter';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<Users> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new HttpException(
        {
          resCode: 'NOT_FOUND_USER',
          message: ErrorCode.NOT_FOUND_USER,
        },
        HttpStatus.OK,
      );
    }
    return user;
  }
}
