import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';
import { TokenType } from '../users.type';

export class VerificationTokenRequestDto {
  @IsNumberString()
  @IsNotEmpty()
  @Length(5, 5)
  token: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(TokenType))
  tokenType: TokenType;
}
