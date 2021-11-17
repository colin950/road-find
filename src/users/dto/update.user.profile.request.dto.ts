import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUsersDTO } from './create.users.dto';

export class UpdateUserProfileRequestDTO extends PartialType(
  PickType(CreateUsersDTO, ['password', 'nickname']),
) {}
