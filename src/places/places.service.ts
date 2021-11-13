import { Injectable } from '@nestjs/common';
import { Position } from 'geojson';
import { Places } from 'src/entities/places.entity';
import { getManager, Like } from 'typeorm';

@Injectable()
export class PlacesService {
  async findPlacesByName(
    name: string,
    page?: number,
    pageSize?: number,
    position?: Position,
  ): Promise<Places[]> {
    if (name.trim() === '') {
      return [];
    }

    const pageOptions = {};

    if (pageSize) {
      pageOptions['take'] = pageSize;
    }

    if (page && pageSize) {
      pageOptions['skip'] = (page - 1) * pageSize;
    }

    if (position) {
      return this.getNearestPlacesByPosition(position, pageOptions);
    }

    return this.getPlacesByName(name, pageOptions);
  }

  private async getPlacesByName(
    name: string,
    pageOptions: {
      take?: number;
      skip?: number;
    },
  ): Promise<Places[]> {
    const getPlacesByName: Places[] = await Places.find({
      where: {
        name: Like(`${name}%`),
      },
      ...pageOptions,
    });

    return getPlacesByName;
  }

  private async getNearestPlacesByPosition(
    position: Position,
    pageOptions: {
      take?: number;
      skip?: number;
    },
  ): Promise<Places[]> {
    const entityManager = getManager();

    // SQL point (경도, 위도)
    const getPlaces = await entityManager.query(
      `SELECT * FROM places ORDER BY coords <-> point '(${position[1]}, ${
        position[0]
      })' LIMIT ${pageOptions?.take ?? 10} OFFSET ${pageOptions?.skip ?? 0};`,
    );

    console.log(getPlaces);

    return [];
  }

  async findPlacesByFullAddress(
    fullAddress: string,
    page?: number,
    pageSize?: number,
  ): Promise<Places[]> {
    const pageOptions = {};

    if (pageSize) {
      pageOptions['take'] = pageSize;
    }

    if (page && pageSize) {
      pageOptions['skip'] = (page - 1) * pageSize;
    }

    const getPlacesByName = await Places.find({
      where: {
        fullAddress: Like(`%${fullAddress}%`),
      },
      ...pageOptions,
    });

    return getPlacesByName;
  }
}
