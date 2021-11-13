import { Controller, Get } from '@nestjs/common';
import { Categories } from 'src/entities/categories.entity';
import { CommonResponse } from 'src/util/interceptors/common.response.interceptor';
import { CategoriesService } from './categories.service';
import { GetCategoriesResposneDTO } from './dto/get-categories.response.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async getCategories(): Promise<CommonResponse<GetCategoriesResposneDTO[]>> {
    const getCategories: Categories[] =
      await this.categoriesService.getCategories();

    const getCategoriesDTOs: GetCategoriesResposneDTO[] = getCategories.map(
      (category) => {
        return GetCategoriesResposneDTO.fromCategory(category);
      },
    );

    return {
      resCode: 'SUCCESS_GET_CATEGORIES',
      message: '카테고리 조회에 성공하였습니다.',
      data: getCategoriesDTOs,
    };
  }
}
