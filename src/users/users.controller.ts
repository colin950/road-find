import { Controller, Post, Body, UseGuards, Put, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUsersDTO } from './dto/create.users.dto';
import { AuthService } from '../auth/auth.service';
import { VerificationTokenRequestDto } from './dto/verification.token.request.dto';
import { ResetPasswordRequestDto } from './dto/reset.password.request.dto';
import { RequestResetPasswordRequestDto } from './dto/request.reset.password.request.dto copy';
import { User } from 'src/util/decorators/user.decorator';
import { AuthUser } from 'src/auth/auth.types';
import { CommonResponse } from 'src/util/interceptors/common.response.interceptor';
import { AccessTokenDTO } from 'src/auth/dto/access.token.dto';
import { SendMailSignUpTokenRequestDTO } from './dto/send-mail-signup-token.request.dto';
import { Users } from 'src/entities/users.entity';
import { UpdateFavoriteCategoryDto as UpdateCategoryDto } from './dto/update.category';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

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

  @Post('/create')
  async create(
    @Body() createUserDTO: CreateUsersDTO,
  ): Promise<CommonResponse<boolean>> {
    await this.usersService.create(
      createUserDTO.email,
      createUserDTO.password,
      createUserDTO.nickname,
      createUserDTO.placeCode,
    );

    return {
      resCode: 'SUCCESS_SIGN_UP',
      message: '회원가입에 성공하였습니다.',
    };
  }

  @Post('/token/signup')
  async sendMailSignUpToken(
    @Body() sendMailSignUpTokenRequestDTO: SendMailSignUpTokenRequestDTO,
  ): Promise<CommonResponse<boolean>> {
    await this.usersService.requestSignUpToken(
      sendMailSignUpTokenRequestDTO.email,
    );

    return {
      resCode: 'SUCCESS_SEND_MAIL_SIGN_UP_TOKEN',
      message: '회원가입 인증 토큰을 전송하였습니다.',
    };
  }

  @Post('/verification/token')
  async verificationToken(
    @Body() verificationTokenRequestDTO: VerificationTokenRequestDto,
  ): Promise<CommonResponse<boolean>> {
    await this.usersService.verificationMailToken(
      verificationTokenRequestDTO.email,
      verificationTokenRequestDTO.token,
      verificationTokenRequestDTO.tokenType,
    );

    return {
      resCode: 'SUCCESS_VERIFYING',
      message: '토큰 인증에 성공하였습니다.',
    };
  }

  @Post('/reset/password')
  async requestResetPassword(
    @Body() { email }: RequestResetPasswordRequestDto,
  ): Promise<CommonResponse<boolean>> {
    await this.usersService.requestResetPassword(email);

    return {
      resCode: 'SUCCESS_REQUEST_RESET_PASSWORD',
      message: '비밀번호 토큰 전송에 성공하였습니다.',
    };
  }

  @Put('/reset/password')
  async resetPassword(
    @Body() { email, password }: ResetPasswordRequestDto,
  ): Promise<CommonResponse<boolean>> {
    await this.usersService.resetPassword(email, password);

    return {
      resCode: 'SUCCESS_RESET_PASSWORD',
      message: '비밀번호 초기화에 성공하였습니다.',
    };
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMyInfo(@User() user: Users) {
    const userInfo = await this.usersService.getUserInfo(user.id);
    return {
      resCode: 'SUCCESS_GET_MY_INFO',
      message: '성공적으로 내 정보를 조회했습니다.',
      data: userInfo,
    };
  }

  @Put('category')
  @UseGuards(JwtAuthGuard)
  async updateCategory(
    @User() user: Users,
    @Body() { categories }: UpdateCategoryDto,
  ) {
    await this.usersService.updateCategory(user, categories);

    return {
      resCode: 'SUCCESS_UPDATE_CATEGORY',
      message: '성공적으로 선호 카테고리를 변경했습니다.',
    };
  }
}
