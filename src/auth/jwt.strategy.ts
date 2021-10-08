import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthUser, JwtPayload } from './auth.types';
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

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await Users.findOne(payload.sub);
    if (!user) {
      throw new NotFoundException(ErrorCode.NOT_FOUND_USER);
    }
    const { password, ...result } = user;
    return result;
  }
}
