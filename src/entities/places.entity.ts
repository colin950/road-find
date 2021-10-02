import { Geometry } from 'geojson';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { CreatedUpdatedTime } from './common/created.updated.time.entity';
import { Roads } from './roads.entity';

@Entity()
export class Places extends CreatedUpdatedTime {
  @PrimaryColumn({ length: 7 })
  code!: string;

  @Column({ default: '' })
  fullAddress!: string;

  @Column({ default: '' })
  name!: string;

  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 })
  @Index({ spatial: true })
  coords!: Geometry;

  // == Relations ==
  @OneToMany(() => Roads, (road) => road.place)
  @JoinTable()
  roads: Roads[];
}
