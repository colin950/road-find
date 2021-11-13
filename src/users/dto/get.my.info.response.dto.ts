import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Categories } from 'src/entities/categories.entity';
import { Places } from 'src/entities/places.entity';
import { Users } from 'src/entities/users.entity';

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
  places: Places | null;

  @ApiProperty()
  favoriteCategories: Categories[];

  // == Static methods ==
  static fromUser(user: Users): GetMyInfoResponseDto {
    const dto = new GetMyInfoResponseDto();
    dto.email = user.email;
    dto.nickname = user.nickname;
    dto.profileImageUrl = user.profileImageUrl ?? null;
    dto.places = user.places;
    dto.favoriteCategories = user.favorite_categories;
    return dto;
  }
}
