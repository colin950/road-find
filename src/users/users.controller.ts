import { Controller, Post, Body, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { CreateUsersDTO } from './dto/create.users.dto';
import { AuthService } from '../auth/auth.service';
import { VerificationTokenRequestDto } from './dto/verification.token.request.dto';
import { ResetPasswordRequestDto } from './dto/reset.password.request.dto';
import { RequestResetPasswordRequestDto } from './dto/request.reset.password.request.dto copy';
import { User } from 'src/util/decorators/user.decorator';
import { AuthUser } from 'src/auth/auth.types';
import { CommonResponse } from 'src/util/interceptors/common.response.interceptor';
import { AccessTokenDTO } from 'src/auth/dto/access.token.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/create')
  async create(
    @Body() { email, password, nickname }: CreateUsersDTO,
  ): Promise<CommonResponse<boolean>> {
    await this.usersService.create(email, password, nickname);

    return {
      resCode: 'SUCCESS_SIGN_UP',
      message: '회원가입에 성공하였습니다.',
      data: true,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@User() user: AuthUser): Promise<CommonResponse<AccessTokenDTO>> {
    const tokens: AccessTokenDTO = await this.authService.login(user);

    return {
      resCode: 'SUCCESS_LOGIN',
      message: '로그인에 성공하였습니다.',
      data: {
        ...tokens,
      },
    };
  }

  @Post('/verification/token')
  async verificationToken(
    @Body() { token, tokenType }: VerificationTokenRequestDto,
  ): Promise<CommonResponse<boolean>> {
    const isVerified: boolean = await this.usersService.verificationToken(
      token,
      tokenType,
    );

    return {
      resCode: 'SUCCESS_VERIFYING',
      message: '토큰 인증에 성공하였습니다.',
      data: isVerified,
    };
  }

  @Post('/reset/password')
  async requestResetPassword(
    @Body() { email }: RequestResetPasswordRequestDto,
  ): Promise<CommonResponse<boolean>> {
    const isRequested: boolean = await this.usersService.requestResetPassword(
      email,
    );

    return {
      resCode: 'SUCCESS_REQUEST_RESET_PASSWORD',
      message: '비밀번호 토큰 전송에 성공하였습니다.',
      data: isRequested,
    };
  }

  @Put('/reset/password')
  async resetPassword(
    @Body() { email, password }: ResetPasswordRequestDto,
  ): Promise<CommonResponse<boolean>> {
    const isReset: boolean = await this.usersService.resetPassword(
      email,
      password,
    );
    return {
      resCode: 'SUCCESS_RESET_PASSWORD',
      message: '비밀번호 초기화에 성공하였습니다.',
      data: isReset,
    };
  }
}
