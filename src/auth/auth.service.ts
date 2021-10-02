import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Users, UserStatus } from '../entities/users.entity';
import { LoginUserDTO } from '../users/dto/login.users.dto';
import { isHashValid } from '../util/cipher';
import { ErrorCode } from '../http-exception.filter';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await Users.findByEmail(email);
    if (!user) throw new NotFoundException(ErrorCode.NOT_FOUND_EMAIL);

    if (user.status === UserStatus.UNCONFIRMED)
      throw new UnauthorizedException(ErrorCode.INVALID_USER_STATUS);

    const isPasswordValid = await isHashValid(pass, user.password);

    if (!isPasswordValid) throw new BadRequestException(ErrorCode.INVALID_PASSWORD)

    if (user && isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
