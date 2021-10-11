import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import { Roads } from './roads.entity';

@Entity()
export class HashTags extends CreatedUpdatedTime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 45, default: '' })
  @Index({ unique: true })
  name!: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  // == Relations ==
  @ManyToMany(() => Roads, {
    onDelete: 'NO ACTION',
  })
  roads?: Roads[];
}
