import {IsEmail, IsNumber, IsString} from 'class-validator'

export class CreateUsersDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  point?: string;

  @IsString()
  phone?: string;
}


