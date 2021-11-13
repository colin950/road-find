import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendMailSignUpTokenRequestDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
