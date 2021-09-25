import {IsEmail, IsNumber, IsString} from 'class-validator'

export class CreateUserDTO {
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

export class LoginUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
