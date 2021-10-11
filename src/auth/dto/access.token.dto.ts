import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
