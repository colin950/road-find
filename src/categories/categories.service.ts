import { Injectable } from '@nestjs/common';
import { Categories } from 'src/entities/categories.entity';

@Injectable()
export class CategoriesService {
  async getCategories(): Promise<Categories[]> {
    const getCategories: Categories[] = await Categories.find({
      order: {
        id: 'ASC',
      },
    });
    return getCategories;
  }
}
