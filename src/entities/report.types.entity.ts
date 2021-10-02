import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import { Reports } from './reports.entity';

@Entity()
export class ReportTypes extends CreatedUpdatedTime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 45, default: '' })
  @Index({ unique: true })
  key!: string;

  @Column({ type: 'varchar', length: 60 })
  name!: string;

  // == Relations ==````
  @OneToMany(() => Reports, (report) => report.reportType)
  reports?: Reports[];
}
