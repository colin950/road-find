import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';

export enum MailTokenType {
  SIGN_UP,
  RESET_PASSWORD,
}

@Entity()
export class MailTokens extends CreatedUpdatedTime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar', length: 20 })
  token!: string;

  @Column({ type: 'smallint', default: MailTokenType.SIGN_UP })
  tokenType!: MailTokenType;

  @Column({ type: 'boolean', default: false })
  isVerified!: boolean;
}
