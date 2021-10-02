import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import { Roads } from './roads.entity';

@Entity()
export class RoadAnalytics extends CreatedUpdatedTime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'smallint', default: 0 })
  emojiGoodCount!: number;

  @Column({ type: 'smallint', default: 0 })
  emojiSadCount!: number;

  @Column({ type: 'smallint', default: 0 })
  emojiMadCount!: number;

  // == Relations ==
  @OneToOne(() => Roads, {
    onDelete: 'CASCADE',
  })
  road: Roads;
}
