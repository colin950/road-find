import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUsersDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  nickname: string;
}
