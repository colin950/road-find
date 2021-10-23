import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export type direction = 'forward' | 'backward';
export const Directions: direction[] = ['forward', 'backward'];

export class GetRoadsRequestDTO {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  placeCode?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  lastId?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty()
  @IsEnum(Directions)
  direction?: direction = 'backward';
}
