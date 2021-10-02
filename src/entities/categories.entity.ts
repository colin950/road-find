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

  @Column({ type: 'varchar', length: 45, default: '' })
  @Index({ unique: true })
  key!: string;

  @Column({ name: 'varchar', length: 60, default: '' })
  name!: string;

  // == Relations ==````
  @OneToMany(() => Roads, (road) => road.category)
  roads?: Roads;
}
