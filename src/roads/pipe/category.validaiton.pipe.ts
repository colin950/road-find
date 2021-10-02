import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Categories } from 'src/entities/categories.entity';
import { CategoryNotFoundException } from '../exceptions/category.not.found.exception';

@Injectable()
export class CategoryValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { categoryId } = value;
    const category = await Categories.findOne(categoryId);

    if (!category) {
      throw new CategoryNotFoundException();
    }

    return value;
  }
}
