import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Position } from 'geojson';
import { Spot } from '../types/spot';

export class CreateRoadRequestDto {
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
  placeCode: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  spots: Spot[] | null;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  hashtags: string[] | null;
}
