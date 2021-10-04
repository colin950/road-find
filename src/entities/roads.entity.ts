import { Geometry } from 'geojson';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Categories } from './categories.entity';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import { HashTags } from './hashtags.entity';
import { Places } from './places.entity';
import { RoadAnalytics } from './road.analytics.entity';
import { RoadImages } from './road.images.entity';
import { RoadSpots } from './road.spots.entity';
import { Users } from './users.entity';

@Entity()
export class Roads extends CreatedUpdatedTime {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ default: '' })
  @Index()
  title!: string;

  @Column({ type: 'text', default: '' })
  content!: string;

  @Column({ type: 'geography', spatialFeatureType: 'LineString', srid: 4326 })
  @Index({ spatial: true })
  routes!: Geometry;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ type: 'float', default: 0 })
  distance?: number;

  // == Relations ==````
  @ManyToOne(() => Users, (user) => user.roads, {
    onDelete: 'CASCADE',
  })
  user!: Users;

  @ManyToOne(() => Places, {
    onDelete: 'SET NULL',
  })
  place!: Places;

  @ManyToOne(() => Categories, (category) => category.roads, {
    onDelete: 'SET NULL',
  })
  category!: Categories | null;

  @ManyToMany(() => HashTags, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinTable()
  hashtags?: HashTags[] | null;

  @OneToOne(() => RoadAnalytics, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  roadAnalytics!: RoadAnalytics;

  @OneToMany(() => RoadSpots, (spot) => spot.road, {
    cascade: true,
  })
  spots: RoadSpots[] | null;

  @OneToMany(() => RoadImages, (image) => image.road, {
    cascade: true,
  })
  images: RoadImages[] | null;
}
