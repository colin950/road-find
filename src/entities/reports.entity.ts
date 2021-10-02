import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import { ReportTypes } from './report.types.entity';
import { Users } from './users.entity';

@Entity()
export class Reports extends CreatedUpdatedTime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  // == Relations ==
  @OneToOne(() => Users)
  @JoinColumn()
  plaintiff: Users;

  @OneToOne(() => Users)
  @JoinColumn()
  defendant: Users;

  @ManyToOne(() => ReportTypes, (reportType) => reportType.reports, {
    onDelete: 'SET NULL',
  })
  reportType!: ReportTypes;
}
