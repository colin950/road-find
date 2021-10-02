import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import { Emojis } from './emojis.entity';
import { Roads } from './roads.entity';
import { Users } from './users.entity';

@Entity()
export class RoadReactionLogs extends CreatedUpdatedTime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  // == Relations ==
  @ManyToOne(() => Users, { persistence: false, onDelete: 'NO ACTION' })
  user: Users;

  @ManyToOne(() => Emojis, { persistence: false, onDelete: 'NO ACTION' })
  emoji: Emojis;

  @ManyToOne(() => Roads, { persistence: false, onDelete: 'NO ACTION' })
  road: Roads;
}
