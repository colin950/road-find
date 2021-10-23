import { Injectable } from '@nestjs/common';
import { Places } from 'src/entities/places.entity';
import { Like } from 'typeorm';

@Injectable()
export class PlacesService {
  async findPlacesByName(
    name: string,
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

    const getPlacesByName: Places[] = await Places.find({
      where: {
        name: Like(`${name}%`),
      },
      ...pageOptions,
    });

    return getPlacesByName;
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
