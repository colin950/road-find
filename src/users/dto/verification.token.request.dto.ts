import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  Length,
} from 'class-validator';
import { MailTokenType } from 'src/entities/mail.tokens.entity';

export class VerificationTokenRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(5, 5)
  token: string;

  @IsNumber()
  @IsNotEmpty()
  @IsIn(Object.values(MailTokenType))
  tokenType: MailTokenType;
}
