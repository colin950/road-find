import { Geometry } from 'geojson';
import { Spot } from 'src/roads/types/spot';
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

  // == Relations ==
  @ManyToOne(() => Roads, (road) => road.spots, {
    onDelete: 'CASCADE',
  })
  road!: Roads;

  // == Static methods ===
  static fromSpot(spot: Spot) {
    const roadSpot = new RoadSpots();

    roadSpot.title = spot.title;
    roadSpot.content = spot.content;
    roadSpot.point = {
      type: 'Point',
      coordinates: [spot.point[0], spot.point[1]],
    };

    return roadSpot;
  }
}
