import { bool } from 'aws-sdk/clients/signer';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Categories } from './categories.entity';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import { Roads } from './roads.entity';

export enum SnsType {
  EMAIL,
  APPLE,
}

export enum UserStatus {
  UNCONFIRMED,
  REGISTERED,
}

@Entity()
export class Users extends CreatedUpdatedTime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column()
  @Index({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ length: 10, default: '' })
  @Index({ unique: true })
  nickname!: string;

  @Column({ type: 'smallint', default: SnsType.EMAIL })
  snsType!: SnsType;

  @Column( { nullable: true })
  @Index({ unique: true })
  snsId?: string;

  @Column({ nullable: true })
  token?: string;

  @Column({
    type: 'smallint',
    default: UserStatus.UNCONFIRMED,
  })
  status!: UserStatus;

  @Column({ type: 'timestamptz', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  signOutAt?: Date;

  @Column({ type: 'bool', default: false })
  isSignOut?: bool;

  @Column({ nullable: true })
  profileImageUrl?: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  // == Relations ==
  @OneToMany(() => Roads, (road) => road.user, {
    cascade: true,
  })
  roads: Roads[];

  @ManyToMany(() => Categories, {
    cascade: true,
  })
  @JoinTable({ name: 'favorite_categories' })
  favorite_categories: Categories[];

  @ManyToMany(() => Roads, {
    cascade: true,
  })
  @JoinTable({ name: 'boomarks' })
  bookmarks: Roads[];

  static async createUser(user: any) {
    return this.createQueryBuilder()
      .insert()
      .into(Users)
      .values(user)
      .execute();
  }

  static async findByEmail(email: string) {
    return this.findOne({ email: email });
  }

  static async findByToken(token: string) {
    return this.findOne({ token: token });
  }

  static async findByResetPasswordToken(token: string) {
    return this.findOne({ resetPasswordToken: token });
  }

  static async findByTokenAndUpdateRegistered(token: string) {
    return this.createQueryBuilder()
      .update(Users)
      .set({
        token: '',
        confirmedAt: new Date(),
        status: UserStatus.REGISTERED,
      })
      .where({ token: token });
  }

  static async findByEmailAndUpdateResetPasswordToken(
    email: string,
    token: string,
  ) {
    return this.createQueryBuilder()
      .update(Users)
      .set({ resetPasswordToken: token })
      .where({ email: email });
  }

  static async findByEmailAndUpdatePassword(email: string, password: any) {
    return this.createQueryBuilder()
      .update(Users)
      .set({ password: password })
      .where({ email: email });
  }
}
