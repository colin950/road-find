import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetPlacesRequestDTO {
  @ApiProperty()
  @IsString()
  keyword: string;

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
}
