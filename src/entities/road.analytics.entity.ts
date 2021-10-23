import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import { Roads } from './roads.entity';

@Entity()
export class RoadAnalytics extends CreatedUpdatedTime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'smallint', default: 0 })
  emojiHeartCount!: number;

  @Column({ type: 'smallint', default: 0 })
  emojiThumbsUpCount!: number;

  @Column({ type: 'smallint', default: 0 })
  emojiLaughCount!: number;

  @Column({ type: 'smallint', default: 0 })
  emojiSurpiseCount!: number;

  @Column({ type: 'smallint', default: 0 })
  emojiSadCount!: number;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  // == Relations ==
  @OneToOne(() => Roads, (road) => road.roadAnalytics, {
    onDelete: 'CASCADE',
  })
  road: Roads;
}
