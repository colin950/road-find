import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { STORAGE_DOMAIN } from 'src/constants';
import { Roads } from 'src/entities/roads.entity';
import { CommonResponse } from 'src/util/interceptors/common.response.interceptor';

import { CreateRoadRequestDto } from './dto/create-road.request.dto copy';
import { CategoryValidationPipe } from './pipe/category.validaiton.pipe';
import { PlaceValidationPipe } from './pipe/place.validaiton.pipe';
import { RoadsService } from './roads.service';
import { MulterFile } from './types/file';

@Controller('roads')
export class RoadsController {
  constructor(private readonly roadsService: RoadsService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('files'))
  async createRoad(
    @UploadedFiles() files: Array<MulterFile> | null,
    @Body(new CategoryValidationPipe(), new PlaceValidationPipe())
    createRoadRequestDto: CreateRoadRequestDto,
  ): Promise<CommonResponse<Roads>> {
    const imageLocations: string[] = files?.map((file: MulterFile) => {
      return `https://${STORAGE_DOMAIN}/${file.key}`;
    });

    const createRoad: Roads = await this.roadsService.createRoad(
      createRoadRequestDto.title,
      createRoadRequestDto.content,
      createRoadRequestDto.routes,
      createRoadRequestDto.spots,
      createRoadRequestDto.distance,
      createRoadRequestDto.placeCode,
      createRoadRequestDto.categoryId,
      imageLocations,
    );

    return {
      resCode: 'SUCCESS_CREATE_ROAD',
      message: '성공적으로 길을 생성했습니다.',
      data: createRoad,
    };
  }
}
