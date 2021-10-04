import { Injectable } from '@nestjs/common';
import { Categories } from 'src/entities/categories.entity';
import { Places } from 'src/entities/places.entity';
import { RoadSpots } from 'src/entities/road.spots.entity';
import { Roads } from 'src/entities/roads.entity';
import { Spot } from './types/spot';

import { Position } from 'geojson';
import { RoadAnalytics } from 'src/entities/road.analytics.entity';
import { RoadImages } from 'src/entities/road.images.entity';
import { HashTags } from 'src/entities/hashtags.entity';
import { In } from 'typeorm';

@Injectable()
export class RoadsService {
  async createRoad(
    title: string,
    content: string,
    distance: number,
    placeCode: string,
    categoryId: number,
    roadOptions: {
      routes: Position[];
      spots?: Spot[] | null;
      images?: string[] | null;
      hashtags?: string[] | null;
    },
  ): Promise<Roads> {
    const place = await Places.findOne(placeCode);
    const category = await Categories.findOne(categoryId);

    // Spot 인터페이스를 가진 객체를 RoadSpots 엔티티 객체로 변환합니다.
    const createRoadSpots: RoadSpots[] | null =
      roadOptions.spots?.map((spot) => {
        return RoadSpots.fromSpot(spot);
      }) ?? null;

    // 이미지 주소 배열을 RoadImages 엔티티 객체로 변환합니다.
    const createImages: RoadImages[] | null =
      roadOptions.images?.map((image) => {
        const roadImage = new RoadImages();
        roadImage.imageUrl = image;
        return roadImage;
      }) ?? null;

    // 해시 태그 배열을 HashTags 엔티티 객체로 변환합니다.
    const getHashTags = roadOptions.hashtags
      ? await HashTags.find({
          where: {
            name: In(roadOptions.hashtags),
          },
        })
      : [];

    const existedHashTags = getHashTags.map((hashTag) => hashTag.name);
    const createdHashTags: HashTags[] | null =
      roadOptions.hashtags
        ?.filter((hashtag) => !existedHashTags.includes(hashtag))
        ?.map((hashtag) => {
          const hashTag = new HashTags();
          hashTag.name = hashtag;
          return hashTag;
        }) ?? [];

    const getAndCreatedHashTags = [...getHashTags, ...createdHashTags];

    // 길 분석 엔티티 객체를 생성합니다.
    const createRoadAnalytics = new RoadAnalytics();

    // 길 엔티티 객체를 생성하여 저장합니다.
    const createRoad = new Roads();
    createRoad.title = title;
    createRoad.content = content;
    createRoad.routes = {
      type: 'LineString',
      coordinates: roadOptions.routes,
    };
    createRoad.spots = createRoadSpots;
    createRoad.distance = distance;
    createRoad.place = place!;
    createRoad.category = category!;
    createRoad.images = createImages;
    createRoad.hashtags = getAndCreatedHashTags;
    createRoad.roadAnalytics = createRoadAnalytics;
    await createRoad.save();

    return createRoad;
  }
}
