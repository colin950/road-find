import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Users, UserStatus } from '../entities/users.entity';
import { hashPassword } from '../util/cipher';
import { randomInt } from 'crypto';
import { ErrorCode } from '../util/interceptors/http-exception.filter';
import * as nodemailer from 'nodemailer';
import { TokenType } from './users.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(private configService: ConfigService) {}

  async create(email: string, password: string, nickname: string) {
    const lowerCaseEmail = email.toLowerCase();
    await this.isAvailableEmail(lowerCaseEmail);

    // encode password
    const encryptedPassword = await hashPassword(password);
    const token = randomInt(10000, 99999).toString();

    const userInfo: any = {
      email: lowerCaseEmail,
      nickname: nickname,
      password: encryptedPassword,
      status: UserStatus.UNCONFIRMED,
      token: token,
    };
    await Users.createUser(userInfo);
    const mail: any = {
      to: email,
      subject: '[나들길] 회원가입 메일 인증',
      text: `아래의 코드를 입력해 인증을 완료해 주세요. ${token}`,
    };
    await this.sendMail(mail);
    return;
  }

  private async sendMail(mail: any) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'mashupnadeulgil@gmail.com',
        clientId: this.configService.get('gmail.clientId'),
        clientSecret: this.configService.get('gmail.clientSecret'),
        accessToken: this.configService.get('gmail.accessToken'),
        refreshToken: this.configService.get('gmail.refreshToken'),
        expires: 3600,
      },
    });

    try {
      await transporter.sendMail({
        from: 'mashupnadeulgil@gmail.com',
        to: mail.to,
        subject: mail.subject,
        text: mail.text,
      });

      transporter.close();
    } catch (err) {
      throw new ServiceUnavailableException(ErrorCode.SEND_MAIL_ERROR);
    }
  }

  private async isAvailableEmail(email: string) {
    const user = await Users.findByEmail(email);
    if (user) throw new BadRequestException(ErrorCode.ALREADY_EXIST_EMAIL);

    return true;
  }

  async verificationToken(token: string, tokenType: string): Promise<boolean> {
    if (tokenType === TokenType.CONFIRMED_TOKEN) {
      const user = await Users.findByToken(token);
      if (!user) throw new NotFoundException(ErrorCode.NOT_FOUND_TOKEN);
      if (user.status === UserStatus.REGISTERED)
        throw new NotFoundException(ErrorCode.INVALID_USER_STATUS);
      await Users.findByTokenAndUpdateRegistered(token);
    } else if (tokenType === TokenType.RESET_PASSWORD_TOKEN) {
      const user = await Users.findByResetPasswordToken(token);
      if (!user) throw new NotFoundException(ErrorCode.NOT_FOUND_TOKEN);
    }
    return true;
  }

  async requestResetPassword(email: string): Promise<boolean> {
    const user = await Users.findByEmail(email);
    if (!user) throw new NotFoundException(ErrorCode.NOT_FOUND_EMAIL);

    const token = randomInt(10000, 99999).toString();
    await Users.findByEmailAndUpdateResetPasswordToken(user.email, token);

    const mail: any = {
      to: email,
      subject: '[나들길] 비밀번호 갱신 메일 인증',
      text: `아래의 코드를 입력해 인증을 완료해 주세요. ${token}`,
    };

    await this.sendMail(mail);
    return true;
  }

  async resetPassword(email: string, password: string): Promise<boolean> {
    const encryptedPassword = await hashPassword(password);
    await Users.findByEmailAndUpdatePassword(email, encryptedPassword);
    return true;
  }
}
