import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { RoadImages } from 'src/entities/road.images.entity';

export class CreateRoadImageResponseDTO {
  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  images: string[] | null;

  // == Static methods ==
  static fromRoadImagesArray(
    roadImages: RoadImages[] | null,
  ): CreateRoadImageResponseDTO {
    const createRoadImageResponseDto = new CreateRoadImageResponseDTO();

    createRoadImageResponseDto.images =
      roadImages?.map((image) => image.imageUrl) ?? null;

    return createRoadImageResponseDto;
  }
}
