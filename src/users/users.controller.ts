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

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/create')
  create(@Body() { email, password, nickname }: CreateUsersDTO) {
    return this.usersService.create(email, password, nickname);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@User() user: AuthUser) {
    return this.authService.login(user);
  }

  @Post('/verification/token')
  verificationToken(@Body() { token, tokenType }: VerificationTokenRequestDto) {
    return this.usersService.verificationToken(token, tokenType);
  }

  @Post('/reset/password')
  requestResetPassword(@Body() { email }: RequestResetPasswordRequestDto) {
    return this.usersService.requestResetPassword(email);
  }

  @Put('/reset/password')
  resetPassword(@Body() { email, password }: ResetPasswordRequestDto) {
    return this.usersService.resetPassword(email, password);
  }
}
