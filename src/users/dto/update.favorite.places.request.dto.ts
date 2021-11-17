import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateFavoritePlacesRequestDTO {
  @ApiProperty()
  @IsString({ each: true })
  placeCodes: string[];
}
