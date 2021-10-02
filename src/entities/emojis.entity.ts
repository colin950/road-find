import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';

@Entity()
export class Emojis extends CreatedUpdatedTime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 45, default: '' })
  @Index({ unique: true })
  key!: string;

  @Column({ name: 'varchar', length: 4, default: '' })
  emoji!: string;
}
