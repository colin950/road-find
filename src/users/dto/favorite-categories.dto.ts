import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Categories } from 'src/entities/categories.entity';

export class FavoriteCategoriesDTO {
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
  static fromCategory(category: Categories): FavoriteCategoriesDTO {
    const favoriteCategoriesDTO = new FavoriteCategoriesDTO();

    favoriteCategoriesDTO.id = Number(category.id);
    favoriteCategoriesDTO.key = category.key;
    favoriteCategoriesDTO.name = category.name;

    return favoriteCategoriesDTO;
  }
}
