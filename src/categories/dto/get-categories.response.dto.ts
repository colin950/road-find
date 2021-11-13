import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Categories } from 'src/entities/categories.entity';

export class GetCategoriesResposneDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  name: string;

  // == Static methods ==
  static fromCategory(category: Categories): GetCategoriesResposneDTO {
    const getCategoriesResponseDTO = new GetCategoriesResposneDTO();

    getCategoriesResponseDTO.id = Number(category.id);
    getCategoriesResponseDTO.key = category.key;
    getCategoriesResponseDTO.name = category.name;

    return getCategoriesResponseDTO;
  }
}
