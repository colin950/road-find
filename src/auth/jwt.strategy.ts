import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { JwtPayload } from './auth.types';
import { Users } from 'src/entities/users.entity';
import { ErrorCode } from 'src/util/interceptors/http-exception.filter';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<Users> {
    const user = await Users.findOne(payload.sub);
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
