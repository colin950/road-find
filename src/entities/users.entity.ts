import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import {UserStatus} from '../users/users.type'

@Entity()
export class Users extends CreatedUpdatedTime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({nullable: true})
  name: string;

  @Column()
  status: string;

  @Column()
  token: string;

  @Column({nullable: true})
  confirmedAt: Date;

  @Column({nullable: true})
  resetPasswordToken: string;

  static async createUser(user: any) {
    return this.createQueryBuilder()
      .insert()
      .into(Users)
      .values(user)
      .execute();
  }

  static async findByEmail(email: string) {
    return this.findOne({ email: email })
  }

  static async findByToken(token: string) {
    return this.findOne({ token: token })
  }

  static async findByResetPasswordToken(token: string) {
    return this.findOne({ resetPasswordToken: token })
  }

  static async findByTokenAndUpdateRegistered(token: string) {
    return this.createQueryBuilder()
      .update(Users)
      .set({ token: '', confirmedAt: new Date(), status: UserStatus.REGISTERED })
      .where({ token: token })
  }

  static async findByEmailAndUpdateResetPasswordToken(email: string, token: string) {
    return this.createQueryBuilder()
      .update(Users)
      .set({ resetPasswordToken: token })
      .where({ email: email })
  }

  static async findByEmailAndUpdatePassword(email: string, password: any) {
    return this.createQueryBuilder()
      .update(Users)
      .set({ password: password })
      .where({ email: email })
  }
}
