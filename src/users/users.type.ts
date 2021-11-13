export enum UserStatus {
  UNCONFIRMED = 'unconfirmed',
  REGISTERED = 'registered',
}

export enum TokenType {
  RESET_PASSWORD_TOKEN = 'reset_password_token',
  CONFIRMED_TOKEN = 'confirmed_token',
}

export interface MailForm {
  to: string;
  subject: string;
  text: string;
}
