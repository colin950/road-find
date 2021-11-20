import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Categories } from 'src/entities/categories.entity';
import { Places } from 'src/entities/places.entity';
import { RoadSpots } from 'src/entities/road.spots.entity';
import { Roads } from 'src/entities/roads.entity';
import { Spot } from './types/spot';

import { Position } from 'geojson';
import { RoadAnalytics } from 'src/entities/road.analytics.entity';
import { RoadImages } from 'src/entities/road.images.entity';
import { HashTags } from 'src/entities/hashtags.entity';
import { Equal, FindOperator, In, LessThan, MoreThan } from 'typeorm';
import { Users } from 'src/entities/users.entity';
import { direction } from './dto/get-roads.request.dto';

@Injectable()
export class RoadsService {
  async createRoad(
    user: Users,
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

    // 이미지 URL 배열로 RoadImages 엔티티 배열을 가져옵니다.
    const getRoadImages = roadOptions.images
      ? await RoadImages.find({
          where: {
            imageUrl: In(roadOptions.images),
          },
        })
      : [];

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
    createRoad.images = getRoadImages;
    createRoad.hashtags =
      getAndCreatedHashTags.length > 0 ? getAndCreatedHashTags : null;
    createRoad.roadAnalytics = createRoadAnalytics;
    createRoad.user = user;
    await createRoad.save();

    return createRoad;
  }

  async updateRoad(
    user: Users,
    roadId: number,
    title?: string,
    content?: string,
    distance?: number,
    placeCode?: string,
    categoryId?: number,
    roadOptions?: {
      routes?: Position[];
      spots?: Spot[] | null;
      images?: string[] | null;
      hashtags?: string[] | null;
    },
  ): Promise<Roads> {
    const updateRoad = await Roads.findOne(roadId);

    if (!updateRoad) {
      throw new HttpException(
        {
          resCode: 'NOT_FOUND_ROAD',
          message: '해당하는 길이 존재하지 않습니다!',
        },
        HttpStatus.OK,
      );
    }

    // 수정 권한을 확인합니다.
    if (updateRoad.user.id !== user.id) {
      throw new HttpException(
        {
          resCode: 'NOT_AUTHORIZED_EDIT',
          message: '수정 권한이 없습니다!',
        },
        HttpStatus.OK,
      );
    }

    if (title) {
      updateRoad.title = title;
    }

    if (content) {
      updateRoad.content = content;
    }

    if (distance) {
      updateRoad.distance = distance;
    }

    // 주소지를 변경합니다. 존재하지 않는 주소지인지 확인합니다.
    if (placeCode) {
      const place = await Places.findOne(placeCode);

      if (!place) {
        throw new HttpException(
          {
            resCode: 'NOT_FOUND_PLACE',
            message: '요청으로 들어온 주소 정보가 없습니다.',
          },
          HttpStatus.OK,
        );
      }

      updateRoad.place = place;
    }

    // 카테고리를 변경합니다. 존재하지 않는 카테고리인지 확인합니다.
    if (categoryId) {
      const category = await Categories.findOne(categoryId);

      if (!category) {
        throw new HttpException(
          {
            resCode: 'NOT_FOUND_CATEGORY',
            message: '카테고리를 조회할 수 없습니다!',
          },
          HttpStatus.OK,
        );
      }

      updateRoad.category = category;
    }

    // routes 데이터를 수정합니다.
    if (roadOptions?.routes) {
      updateRoad.routes = {
        type: 'LineString',
        coordinates: roadOptions.routes,
      };
    }

    // Spot 인터페이스를 가진 객체를 RoadSpots 엔티티 객체로 변환합니다.
    const createRoadSpots: RoadSpots[] | null =
      roadOptions?.spots?.map((spot) => {
        return RoadSpots.fromSpot(spot);
      }) ?? null;

    if (createRoadSpots) {
      updateRoad.spots = createRoadSpots;
    }

    // 이미지 주소 배열을 RoadImages 엔티티 객체로 변환하여 추가합니다.
    if (roadOptions?.images) {
      const beforeRoadImages = updateRoad.images ?? [];
      const beforeRoadImageURLs = beforeRoadImages.map(
        (roadImage) => roadImage.imageUrl,
      );

      const afterRoadImageURLs = roadOptions.images ?? [];

      const concatRoadImages = beforeRoadImageURLs.concat(afterRoadImageURLs);

      const getCurrentRoadImages = await RoadImages.find({
        where: {
          imageUrl: In(concatRoadImages),
        },
      });

      const updateRoadImages = getCurrentRoadImages.filter((roadImage) => {
        return afterRoadImageURLs.includes(roadImage.imageUrl);
      });

      const deletedRoadImages = getCurrentRoadImages.filter((roadImage) => {
        return afterRoadImageURLs.includes(roadImage.imageUrl) === false;
      });

      for (const deletedRoadImage of deletedRoadImages) {
        await deletedRoadImage.softRemove();
      }

      updateRoad.images = updateRoadImages;
    }

    // 해시 태그 배열을 HashTags 엔티티 객체로 변환합니다.
    const getHashTags = roadOptions?.hashtags
      ? await HashTags.find({
          where: {
            name: In(roadOptions?.hashtags),
          },
        })
      : [];

    const existedHashTags = getHashTags.map((hashTag) => hashTag.name);
    const createdHashTags: HashTags[] | null =
      roadOptions?.hashtags
        ?.filter((hashtag) => !existedHashTags.includes(hashtag))
        ?.map((hashtag) => {
          const hashTag = new HashTags();
          hashTag.name = hashtag;
          return hashTag;
        }) ?? [];

    const getAndCreatedHashTags = [...getHashTags, ...createdHashTags];

    if (getAndCreatedHashTags.length > 0) {
      updateRoad.hashtags = getAndCreatedHashTags;
    }

    await updateRoad.save();
    return updateRoad;
  }

  async deleteRoad(user: Users, roadId: number): Promise<boolean> {
    const updateRoad: Roads | undefined = await Roads.findOne(roadId);

    if (!updateRoad) {
      throw new HttpException(
        {
          resCode: 'NOT_FOUND_ROAD',
          message: '해당하는 길이 존재하지 않습니다!',
        },
        HttpStatus.OK,
      );
    }

    // 수정 권한을 확인합니다.
    if (updateRoad.user.id !== user.id) {
      throw new HttpException(
        {
          resCode: 'NOT_AUTHORIZED_EDIT',
          message: '수정 권한이 없습니다!',
        },
        HttpStatus.OK,
      );
    }

    await updateRoad.softRemove();
    return true;
  }

  async getRoadById(roadId: number): Promise<Roads> {
    const roadById = await Roads.findOne(roadId);

    if (!roadById) {
      throw new HttpException(
        {
          resCode: 'NOT_FOUND_ROAD',
          message: '해당하는 길이 존재하지 않습니다!',
        },
        HttpStatus.OK,
      );
    }

    return roadById;
  }

  async getRoadsByCategory(
    categoryId: number,
    findOptions?: {
      lastId?: number;
      limit?: number;
      direction?: direction;
    },
  ): Promise<Roads[]> {
    const whereOptions: Record<string, FindOperator<number>> = {
      category: Equal(categoryId),
    };

    const orderOptions: Record<string, 'ASC' | 'DESC' | 1 | -1 | undefined> = {
      id: 'DESC',
    };

    if (findOptions && findOptions.lastId) {
      findOptions.direction ||= 'backward';
      if (findOptions.direction === 'backward') {
        whereOptions.id = LessThan(findOptions.lastId);
      } else if (findOptions.direction === 'forward') {
        whereOptions.id = MoreThan(findOptions.lastId);
        orderOptions.id = 'ASC';
      }
    }

    let takeLimitation = 10;
    if (findOptions && findOptions.limit && findOptions.limit > 0) {
      takeLimitation = findOptions.limit;
    }

    const roads = await Roads.find({
      where: whereOptions,
      take: takeLimitation,
      order: orderOptions,
    });

    if (findOptions && findOptions.direction === 'forward') {
      roads.reverse();
    }

    return roads;
  }

  async getRoadsByPlaceCode(
    placeCode: string,
    findOptions?: {
      lastId?: number;
      limit?: number;
      direction?: direction;
    },
  ): Promise<Roads[]> {
    const whereOptions: Record<string, FindOperator<number | string>> = {
      place: Equal(placeCode),
    };

    const orderOptions: Record<string, 'ASC' | 'DESC' | 1 | -1 | undefined> = {
      id: 'DESC',
    };

    if (findOptions && findOptions.lastId) {
      findOptions.direction ||= 'backward';
      if (findOptions.direction === 'backward') {
        whereOptions.id = LessThan(findOptions.lastId);
      } else if (findOptions.direction === 'forward') {
        whereOptions.id = MoreThan(findOptions.lastId);
        orderOptions.id = 'ASC';
      }
    }

    let takeLimitation = 10;
    if (findOptions && findOptions.limit && findOptions.limit > 0) {
      takeLimitation = findOptions.limit;
    }

    const roads = await Roads.find({
      where: whereOptions,
      take: takeLimitation,
      order: orderOptions,
    });

    if (findOptions && findOptions.direction === 'forward') {
      roads.reverse();
    }

    return roads;
  }

  async createRoadImages(
    imageLocations: string[] | null,
  ): Promise<RoadImages[] | null> {
    // 이미지 주소 배열을 RoadImages 엔티티 객체로 변환합니다.
    const createImages: RoadImages[] | null =
      imageLocations?.map((image) => {
        const roadImage = new RoadImages();
        roadImage.imageUrl = image;
        roadImage.save();
        return roadImage;
      }) ?? null;

    return createImages;
  }
}
