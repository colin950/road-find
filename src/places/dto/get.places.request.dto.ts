import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Position } from 'geojson';

export class GetPlacesRequestDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  position_x?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  position_y?: number;
}
