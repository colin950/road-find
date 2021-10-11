import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users, UserStatus } from '../entities/users.entity';
import { isHashValid } from '../util/cipher';
import { ErrorCode } from '../util/interceptors/http-exception.filter';
import { AuthUser, JwtPayload } from './auth.types';
import { AccessTokenDTO } from './dto/access.token.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<AuthUser | null> {
    const user = await Users.findByEmail(email);
    if (!user) throw new NotFoundException(ErrorCode.NOT_FOUND_EMAIL);

    if (user.status === UserStatus.UNCONFIRMED)
      throw new UnauthorizedException(ErrorCode.INVALID_USER_STATUS);

    const isPasswordValid = await isHashValid(pass, user.password);

    if (!isPasswordValid)
      throw new BadRequestException(ErrorCode.INVALID_PASSWORD);

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
