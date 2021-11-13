import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../entities/users.entity';
import { isHashValid } from '../util/cipher';
import { ErrorCode } from '../util/interceptors/http-exception.filter';
import { AuthUser, JwtPayload } from './auth.types';
import { AccessTokenDTO } from './dto/access.token.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<AuthUser | null> {
    const user = await Users.findByEmail(email);
    if (!user) {
      throw new HttpException(
        {
          resCode: 'NOT_FOUND_EMAIL',
          message: ErrorCode.NOT_FOUND_EMAIL,
        },
        400,
      );
    }

    const isPasswordValid = await isHashValid(pass, user.password);

    if (!isPasswordValid)
      throw new HttpException(
        {
          resCode: 'INVALID_PASSWORD',
          message: ErrorCode.INVALID_PASSWORD,
        },
        400,
      );

    if (user && isPasswordValid) {
      const { password, ...result } = user;
      return result as AuthUser;
    }
    return null;
  }

  login(user: AuthUser): AccessTokenDTO {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
