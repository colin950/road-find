import {Column, Entity, Index, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import {Roads} from './roads.entity'
import {Users} from './users.entity'

@Entity()
export class Bookmarks extends CreatedUpdatedTime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Index()
  @Column()
  userId!: number;

  // == Relations ==
  @ManyToOne(() => Roads, (road) => road.bookmarks)
  road!: Roads | null;
}
