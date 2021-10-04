import { Position } from 'geojson';

export interface Spot {
  title: string;
  content: string;
  point: Position;
}
