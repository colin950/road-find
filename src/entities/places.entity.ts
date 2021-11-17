import { Geometry } from 'geojson';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import { Roads } from './roads.entity';
import { Users } from './users.entity';

@Entity()
export class Places extends CreatedUpdatedTime {
  @PrimaryColumn({ length: 7 })
  code!: string;

  @Index({ unique: true })
  @Column({ default: '' })
  fullAddress!: string;

  @Index()
  @Column({ default: '' })
  name!: string;

  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 })
  @Index({ spatial: true })
  coords!: Geometry;

  // == Relations ==
  @OneToMany(() => Roads, (road) => road.place)
  roads: Roads[];

  @OneToMany(() => Users, (user) => user.places)
  users: Users[];
}
