import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateRoadRequestDTO } from './create-road.request.dto';

export class UpdateRoadRequestDTO extends PartialType(CreateRoadRequestDTO) {
  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  deletedImageUrls?: string[] | null;
}
