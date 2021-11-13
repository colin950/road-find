import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Categories } from './categories.entity';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import { Places } from './places.entity';
import { Roads } from './roads.entity';

export enum SnsType {
  EMAIL,
  APPLE,
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

  @Column({ nullable: true })
  @Index({ unique: true })
  snsId?: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ type: 'timestamptz', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  signOutAt?: Date;

  @Column({ type: 'boolean', default: false })
  isSignOut?: boolean;

  @Column({ nullable: true })
  profileImageUrl?: string;

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

  @OneToOne(() => Places, { cascade: true, nullable: true })
  @JoinColumn()
  places: Places | null;

  static async createUser(user: any) {
    return await this.createQueryBuilder()
      .insert()
      .into(Users)
      .values(user)
      .execute();
  }

  static async findByEmail(email: string) {
    return await this.findOne({ email });
  }

  static async findByNickname(nickname: string) {
    return await this.findOne({ nickname });
  }

  static async findByToken(token: string) {
    return await this.findOne({ token: token });
  }

  static async findByEmailAndUpdatePassword(email: string, password: any) {
    return await this.createQueryBuilder()
      .update(Users)
      .set({ password: password })
      .where({ email: email })
      .execute();
  }
}
