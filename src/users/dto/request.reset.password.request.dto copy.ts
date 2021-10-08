import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestResetPasswordRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
