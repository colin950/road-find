import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import { Roads } from './roads.entity';

@Entity()
export class Categories extends CreatedUpdatedTime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ length: 45, default: '' })
  @Index({ unique: true })
  key!: string;

  @Column({ length: 60, default: '' })
  name!: string;

  // == Relations ==````
  @OneToMany(() => Roads, (road) => road.category)
  roads?: Roads;
}
