import {
  Controller,
  Post,
  Body, UseGuards, Req, Put,
} from '@nestjs/common'
import {UsersService} from './users.service';
import {LocalAuthGuard} from '../auth/local-auth.guard';
import {CreateUsersDTO} from './dto/create.users.dto';
import {AuthService} from '../auth/auth.service'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    ) {}

  @Post('/create')
  create(@Body() createUserDto: CreateUsersDTO) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('/verification/token')
  verificationToken(@Body() token: string, tokenType: string) {
    return this.usersService.verificationToken(token, tokenType)
  }

  @Post('/reset/password')
  requestResetPassword(@Body() email: string) {
    return this.usersService.requestResetPassword(email)
  }

  @Put('/reset/password')
  resetPassword(@Body() email: string, password: string) {
    return this.usersService.resetPassword(email, password)
  }
}
