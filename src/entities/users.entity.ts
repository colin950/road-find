import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
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
  @Index()
  email!: string;

  @Column({ select: false })
  password?: string;

  @Column({ length: 10, default: '' })
  @Index({ unique: true })
  nickname!: string;

  @Column({ type: 'smallint', default: SnsType.EMAIL })
  snsType!: SnsType;

  @Column({ nullable: true })
  @Index({ unique: true })
  snsId?: string;

  @Column({ length: 10, nullable: true })
  token?: string;

  @Column({ nullable: true })
  profileImageUrl?: string;

  // == Relations ==
  @OneToMany(() => Roads, (road) => road.user, {
    cascade: true,
  })
  roads: Promise<Roads[]>;

  @ManyToMany(() => Categories, {
    cascade: true,
    eager: true,
  })
  @JoinTable({ name: 'favorite_categories' })
  favoriteCategories: Categories[];

  @ManyToMany(() => Places, {
    cascade: true,
    eager: true,
  })
  @JoinTable({ name: 'favorite_places' })
  favoritePlaces: Places[];

  @ManyToOne(() => Places, (place) => place.users, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  places: Places | null;

  @ManyToMany(() => Roads, {
    cascade: true,
  })
  @JoinTable({ name: 'boomarks' })
  bookmarks: Promise<Roads[]>;

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

  static async findPasswordByEmail(email: string) {
    return await this.createQueryBuilder()
      .addSelect('Users.password')
      .where({ email })
      .getOne();
  }
}
