import {
  Column,
  Entity,
  Index,
  JoinTable,
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

  // == Relations ==````
  @ManyToMany(() => Roads, {
    onDelete: 'CASCADE',
  })
  roads?: Roads;
}
