import { HttpException, Injectable } from '@nestjs/common';
import { Users } from '../entities/users.entity';
import { hashPassword } from '../util/cipher';
import { randomInt } from 'crypto';
import { ErrorCode } from '../util/interceptors/http-exception.filter';
import * as nodemailer from 'nodemailer';
import { MailForm } from './users.type';
import { ConfigService } from '@nestjs/config';
import { MailTokens, MailTokenType } from 'src/entities/mail.tokens.entity';
import { Equal } from 'typeorm';
import { Places } from 'src/entities/places.entity';

@Injectable()
export class UsersService {
  constructor(private configService: ConfigService) {}

  async create(
    email: string,
    password: string,
    nickname: string,
    placeCode: string,
  ): Promise<Users> {
    const lowerCaseEmail = email.toLowerCase();
    await this.validateUserEmail(lowerCaseEmail);
    await this.validateUserNickname(nickname);

    const getPlace = await Places.findOne(placeCode);
    await this.validatePlace(getPlace);

    // encode password
    const encryptedPassword = await hashPassword(password);

    const createUser = new Users();
    createUser.email = lowerCaseEmail;
    createUser.password = encryptedPassword;
    createUser.nickname = nickname;
    createUser.places = getPlace ?? null;
    await createUser.save();

    return createUser;
  }

  private async validateUserEmail(email: string): Promise<boolean> {
    const user = await Users.findByEmail(email);
    if (user) {
      throw new HttpException(
        {
          resCode: 'ALREADY_EXIST_EMAIL',
          message: ErrorCode.ALREADY_EXIST_EMAIL,
        },
        400,
      );
    }

    return true;
  }

  private async validateUserNickname(nickname: string): Promise<boolean> {
    const user = await Users.findByNickname(nickname);
    if (user) {
      throw new HttpException(
        {
          resCode: 'NOT_FOUND_NICKNAME',
          message: ErrorCode.ALREADY_EXIST_NICKNAME,
        },
        400,
      );
    }

    return true;
  }

  private async validatePlace(place?: Places) {
    if (!place) {
      throw new HttpException(
        {
          resCode: 'NOT_FOUND_PLACE',
          message: ErrorCode.NOT_FOUND_PLACE,
        },
        400,
      );
    }

    return true;
  }

  private async sendMail(mailForm: MailForm) {
    const fromEmail = this.configService.get('gmail.email');

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: fromEmail,
          clientId: this.configService.get('gmail.clientId'),
          clientSecret: this.configService.get('gmail.clientSecret'),
          accessToken: this.configService.get('gmail.accessToken'),
          refreshToken: this.configService.get('gmail.refreshToken'),
          expires: 3600,
        },
      });

      await transporter.sendMail({
        from: fromEmail,
        to: mailForm.to,
        subject: mailForm.subject,
        text: mailForm.text,
      });

      transporter.close();
    } catch (err) {
      throw new HttpException(
        {
          resCode: 'SEND_MAIL_ERROR',
          message: '메일 보내기에 실패하였습니다.',
        },
        400,
      );
    }
  }

  async verificationMailToken(
    email: string,
    token: string,
    tokenType: MailTokenType,
  ): Promise<boolean> {
    const getMailTokens: MailTokens[] = await MailTokens.find({
      where: {
        email: Equal(email),
        tokenType: tokenType,
      },
      order: {
        id: 'DESC',
      },
      take: 1,
    });

    if (getMailTokens.length === 0) {
      throw new HttpException(
        {
          resCode: 'NOT_FOUND_TOKEN',
          message: ErrorCode.NOT_FOUND_TOKEN,
        },
        400,
      );
    }

    const getMailToken = getMailTokens[0];

    if (getMailToken.token !== token) {
      return false;
    }

    if (getMailToken.isVerified) {
      throw new HttpException(
        {
          resCode: 'ALREADY_VERIFIED_TOKEN',
          message: '이미 토큰 인증을 성공했습니다.',
        },
        400,
      );
    }

    getMailToken.isVerified = true;
    await getMailToken.save();

    return true;
  }

  async resetPassword(email: string, password: string): Promise<boolean> {
    const encryptedPassword = await hashPassword(password);
    await Users.findByEmailAndUpdatePassword(email, encryptedPassword);
    return true;
  }

  async requestSignUpToken(email: string): Promise<boolean> {
    const randomFiveLengthToken = this.getRandomFiveLengthToken();
    await this.saveMailTokenWithRandomToken(
      email,
      randomFiveLengthToken,
      MailTokenType.SIGN_UP,
    );

    const mailForm: MailForm = {
      to: email,
      subject: '[나들길] 회원가입 메일 인증',
      text: `아래의 코드를 입력해 인증을 완료해 주세요. ${randomFiveLengthToken}`,
    };
    await this.sendMail(mailForm);

    return true;
  }

  async requestResetPassword(email: string): Promise<boolean> {
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

    const randomFiveLengthToken = this.getRandomFiveLengthToken();
    await this.saveMailTokenWithRandomToken(
      email,
      randomFiveLengthToken,
      MailTokenType.RESET_PASSWORD,
    );

    const mailForm: MailForm = {
      to: email,
      subject: '[나들길] 비밀번호 갱신 메일 인증',
      text: `아래의 코드를 입력해 인증을 완료해 주세요. ${randomFiveLengthToken}`,
    };
    await this.sendMail(mailForm);

    return true;
  }

  private getRandomFiveLengthToken(): string {
    const randomToken = randomInt(10000, 99999).toString();
    return randomToken;
  }

  private async saveMailTokenWithRandomToken(
    email: string,
    randomToken: string,
    tokenType: MailTokenType = MailTokenType.SIGN_UP,
  ) {
    const mailToken = new MailTokens();
    mailToken.email = email;
    mailToken.token = randomToken;
    mailToken.tokenType = tokenType;
    await mailToken.save();
  }
}
