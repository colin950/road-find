import { PickType } from '@nestjs/swagger';
import { CreateUsersDTO } from './create.users.dto';

export class LoginUserDTO extends PickType(CreateUsersDTO, [
  'email',
  'password',
] as const) {}
