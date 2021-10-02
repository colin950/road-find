import { Injectable } from '@nestjs/common';
import { Categories } from 'src/entities/categories.entity';
import { Places } from 'src/entities/places.entity';
import { RoadSpots } from 'src/entities/road.spots.entity';
import { Roads } from 'src/entities/roads.entity';
import { point } from './types/point';
import { Spot } from './types/spot';

import { Point, LineString } from 'geojson';
import { RoadAnalytics } from 'src/entities/road.analytics.entity';
import { RoadImages } from 'src/entities/road.images.entity';

@Injectable()
export class RoadsService {
  async createRoad(
    title: string,
    content: string,
    routes: point[],
    spots: Spot[] | null,
    distance: number,
    placeCode: string,
    categoryId: number,
    images: string[] | null,
  ): Promise<Roads> {
    const place = await Places.findOne(placeCode);
    const category = await Categories.findOne(categoryId);

    const convertedRoadSpots: RoadSpots[] = spots?.map((spot) => {
      const roadSpot = new RoadSpots();
      roadSpot.title = spot.title;
      roadSpot.content = spot.content;
      roadSpot.point = {
        type: 'Point',
        coordinates: [spot.point[0], spot.point[1]],
      };

      return roadSpot;
    });

    const createImages: RoadImages[] = images?.map((image) => {
      const roadImage = new RoadImages();
      roadImage.imageUrl = image;
      return roadImage;
    });

    const createRoadAnalytics = new RoadAnalytics();

    const createRoad = new Roads();
    createRoad.title = title;
    createRoad.content = content;
    createRoad.routes = {
      type: 'LineString',
      coordinates: routes,
    };
    createRoad.spots = convertedRoadSpots;
    createRoad.distance = distance;
    createRoad.place = place;
    createRoad.category = category;
    createRoad.roadAnalytics = createRoadAnalytics;
    createRoad.images = createImages ?? null;
    await createRoad.save();

    return createRoad;
  }
}
