import { PickType } from '@nestjs/swagger';
import { CreateUsersDTO } from './create.users.dto';

export class ResetPasswordRequestDto extends PickType(CreateUsersDTO, [
  'email',
  'password',
] as const) {}
