import {
  Controller,
  Post,
  Body, UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service';
import {LocalAuthGuard} from '../auth/local-auth.guard';
import { CreateUserDTO, LoginUserDTO } from './users.dto';
import {AuthService} from '../auth/auth.service'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    ) {}

  @Post('/create')
  create(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Body() loginUserDTO: LoginUserDTO) {
    return this.authService.login(loginUserDTO);
  }
}
