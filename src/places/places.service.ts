import { Injectable } from '@nestjs/common';
import { Point, Position } from 'geojson';
import { Places } from 'src/entities/places.entity';
import { getManager, Like } from 'typeorm';

@Injectable()
export class PlacesService {
  async findPlacesByName(
    name: string,
    page?: number,
    pageSize?: number,
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

  async getNearestPlacesByPosition(
    position: Position,
    page?: number,
    pageSize?: number,
  ): Promise<Places[]> {
    const pageOptions = {
      take: 10,
      skip: 0,
    };

    if (pageSize) {
      pageOptions['take'] = pageSize;
    }

    if (page && pageSize) {
      pageOptions['skip'] = (page - 1) * pageSize;
    }

    const entityManager = getManager();

    // SQL point (경도, 위도)
    const getPlaces: any[] = await entityManager.query(
      `SELECT *, ST_X(coords::geometry), ST_Y(coords::geometry) FROM road.places ORDER BY coords <-> 'POINT (${position[0]} ${position[1]})' LIMIT ${pageOptions.take} OFFSET ${pageOptions.skip};`,
    );

    const mappedPlaces = getPlaces.map((place) => {
      place.fullAddress = place.full_address;
      delete place['full_address'];

      place.coords = {
        type: 'Point',
        coordinates: [place.st_x, place.st_y],
      } as Point;

      delete place['st_x'];
      delete place['st_y'];

      return place;
    });

    console.log(mappedPlaces[0]);

    return mappedPlaces;
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
