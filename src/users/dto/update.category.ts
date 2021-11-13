import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateFavoriteCategoryDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  categories: string[];
}
