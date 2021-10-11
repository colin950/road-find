import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LineString, Point, Position } from 'geojson';
import { Roads } from 'src/entities/roads.entity';
import { Spot } from '../types/spot';

export class CreateRoadResponseDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  routes: Position[];

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  distance: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  place: string | null;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  category: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  images: string[] | null;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  spots: Spot[] | null;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  hashtags: string[] | null;

  // == Static methods ==
  static fromRoad(road: Roads): CreateRoadResponseDTO {
    const createRoadResponseDto = new CreateRoadResponseDTO();

    createRoadResponseDto.title = road.title;
    createRoadResponseDto.content = road.content;
    createRoadResponseDto.distance = road.distance;
    createRoadResponseDto.place = road.place?.fullAddress ?? null;
    createRoadResponseDto.category = road.category?.key ?? null;

    createRoadResponseDto.routes = (road.routes as LineString).coordinates;
    createRoadResponseDto.spots =
      road.spots?.map((spot) => {
        return {
          title: spot.title,
          content: spot.title,
          point: (spot.point as Point).coordinates,
        } as Spot;
      }) ?? null;

    createRoadResponseDto.images =
      road.images?.map((image) => image.imageUrl) ?? null;
    createRoadResponseDto.hashtags =
      road.hashtags?.map((hashtag) => hashtag.name) ?? null;

    return createRoadResponseDto;
  }
}
