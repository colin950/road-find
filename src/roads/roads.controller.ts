import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roads } from 'src/entities/roads.entity';
import { CommonResponse } from 'src/util/interceptors/common.response.interceptor';

import { CreateRoadRequestDto } from './dto/create-road.request.dto copy';
import { CategoryValidationPipe } from './pipe/category.validaiton.pipe';
import { PlaceValidationPipe } from './pipe/place.validaiton.pipe';
import { RoadsService } from './roads.service';

@Controller('roads')
export class RoadsController {
  constructor(private readonly roadsService: RoadsService) {}

  @Post('')
  // @UseInterceptors(FilesInterceptor('files'))
  async createRoad(
    // @UploadedFiles() files: File[],
    @Body(new CategoryValidationPipe(), new PlaceValidationPipe())
    createRoadRequestDto: CreateRoadRequestDto,
  ): Promise<CommonResponse<Roads>> {
    const createRoad: Roads = await this.roadsService.createRoad(
      createRoadRequestDto.title,
      createRoadRequestDto.content,
      createRoadRequestDto.routes,
      createRoadRequestDto.spots,
      createRoadRequestDto.distance,
      createRoadRequestDto.placeCode,
      createRoadRequestDto.categoryId,
    );

    return {
      resCode: 'SUCCESS_CREATE_ROAD',
      message: '성공적으로 길을 생성했습니다.',
      data: createRoad,
    };
  }
}
