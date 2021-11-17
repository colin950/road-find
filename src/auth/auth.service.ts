import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../entities/users.entity';
import { isHashValid } from '../util/cipher';
import { ErrorCode } from '../util/interceptors/http-exception.filter';
import { JwtPayload } from './auth.types';
import { AccessTokenDTO } from './dto/access.token.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<Users | null> {
    const user = await Users.findPasswordByEmail(email);
    if (!user) {
      throw new HttpException(
        {
          resCode: 'NOT_FOUND_EMAIL',
          message: ErrorCode.NOT_FOUND_EMAIL,
        },
        HttpStatus.OK,
      );
    }

    const isPasswordValid = await isHashValid(pass, user.password);

    if (!isPasswordValid)
      throw new HttpException(
        {
          resCode: 'INVALID_PASSWORD',
          message: ErrorCode.INVALID_PASSWORD,
        },
        HttpStatus.OK,
      );

    if (user && isPasswordValid) {
      return user;
    }
    return null;
  }

  login(user: Users): AccessTokenDTO {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
