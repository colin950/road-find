import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Users } from 'src/entities/users.entity';
import { GetPlacesResponseDTO } from 'src/places/dto/get.places.response.dto';
import { FavoriteCategoriesDTO } from './favorite-categories.dto';
import { FavoritePlacesDTO } from './favorite.places.dto';

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
  @IsObject()
  places: GetPlacesResponseDTO | null;

  @ApiProperty()
  @IsObject({ each: true })
  favoriteCategories: FavoriteCategoriesDTO[];

  @ApiProperty()
  @IsObject({ each: true })
  favoritePlaces: FavoritePlacesDTO[];

  // == Static methods ==
  static fromUser(user: Users): GetMyInfoResponseDto {
    const dto = new GetMyInfoResponseDto();
    dto.email = user.email;
    dto.nickname = user.nickname;
    dto.profileImageUrl = user.profileImageUrl ?? null;
    dto.places = user.places
      ? GetPlacesResponseDTO.fromPlace(user.places)
      : null;
    dto.favoriteCategories =
      user.favoriteCategories?.map((category) => {
        return FavoriteCategoriesDTO.fromCategory(category);
      }) ?? [];
    dto.favoritePlaces =
      user.favoritePlaces?.map((place) => {
        return FavoritePlacesDTO.fromPlaces(place);
      }) ?? [];
    return dto;
  }
}
