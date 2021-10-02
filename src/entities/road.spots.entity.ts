import { Geometry } from 'geojson';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import { Roads } from './roads.entity';

@Entity()
export class RoadSpots extends CreatedUpdatedTime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ default: '' })
  @Index()
  title!: string;

  @Column({ default: '' })
  content!: string;

  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 })
  @Index({ spatial: true })
  point!: Geometry;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  // == Relations ==````
  @ManyToOne(() => Roads, (road) => road.spots, {
    onDelete: 'CASCADE',
  })
  road!: Roads;
}
