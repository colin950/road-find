import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Categories } from 'src/entities/categories.entity';
import { Places } from 'src/entities/places.entity';
import { Users } from 'src/entities/users.entity';
import { GetPlacesResponseDTO } from 'src/places/dto/get.places.response.dto';
import { FavoriteCategoriesDTO } from './favorite-categories.dto';

export class GetMyInfoResponseDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  nickname: string;

  @ApiProperty()
  @IsNotEmpty()
  profileImageUrl: string | null;

  @ApiProperty()
  places: GetPlacesResponseDTO | null;

  @ApiProperty()
  favoriteCategories: FavoriteCategoriesDTO[];

  // == Static methods ==
  static fromUser(user: Users): GetMyInfoResponseDto {
    const dto = new GetMyInfoResponseDto();
    dto.email = user.email;
    dto.nickname = user.nickname;
    dto.profileImageUrl = user.profileImageUrl ?? null;
    dto.places = user.places
      ? GetPlacesResponseDTO.fromPlace(user.places)
      : null;
    dto.favoriteCategories = user.favorite_categories.map((category) => {
      return FavoriteCategoriesDTO.fromCategory(category);
    });
    return dto;
  }
}
