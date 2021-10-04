import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import { Roads } from './roads.entity';

@Entity()
export class RoadImages extends CreatedUpdatedTime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column()
  @Index()
  imageUrl!: string;

  // == Relations ==````
  @ManyToOne(() => Roads, (road) => road.images, {
    onDelete: 'CASCADE',
  })
  road!: Roads;
}
