import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { STORAGE_DOMAIN } from 'src/constants';
import { Roads } from 'src/entities/roads.entity';
import { Users } from 'src/entities/users.entity';
import { User } from 'src/util/decorators/user.decorator';
import { CommonResponse } from 'src/util/interceptors/common.response.interceptor';
import { CreateRoadImageResponseDTO } from './dto/create-road-image.response.dto';

import { CreateRoadRequestDTO } from './dto/create-road.request.dto';
import { CreateRoadResponseDTO } from './dto/create-road.response.dto';
import { GetRoadResponseDTO } from './dto/get-road.response.dto';
import { GetRoadsRequestDTO } from './dto/get-roads.request.dto';
import { GetRoadsResponseDTO } from './dto/get-roads.response.dto';
import { UpdateRoadRequestDTO } from './dto/update-road.request.dto';
import { CategoryValidationPipe } from './pipe/category.validaiton.pipe';
import { PlaceValidationPipe } from './pipe/place.validaiton.pipe';
import { RoadsService } from './roads.service';
import { MulterFile } from './types/file';
import {PagingDTO} from './dto/paging.dto'

@Controller('roads')
export class RoadsController {
  constructor(private readonly roadsService: RoadsService) {}

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyRoad(
    @User() user: Users,
    @Query() pagingDTO: PagingDTO
  ) {
    const getRoadsOrNull = await this.roadsService.getMyRoad(
      user,
      pagingDTO.page,
      pagingDTO.pageSize
    )

    return {
      resCode: 'SUCCESS_UPDATE_BOOKMARK',
      message: '성공적으로 나의길 목록을 조회했습니다.',
      data: GetRoadsResponseDTO.fromRoads(getRoadsOrNull),
    }
  }

  @Put('bookmark/:id')
  @UseGuards(JwtAuthGuard)
  async updateBookMark(
    @User() user: Users,
    @Param('id') roadId: string,
  ) {
    const data = await this.roadsService.updateBookMark(user, Number(roadId));

    return {
      resCode: 'SUCCESS_UPDATE_BOOKMARK',
      message: '성공적으로 북마크를 변경했습니다.',
      data: data
    };
  }

  @Get('bookmark')
  @UseGuards(JwtAuthGuard)
  async getBookMark(
    @User() user: Users,
    @Query() pagingDTO: PagingDTO
  ) {
    const getRoadsOrNull = await this.roadsService.getBookMark(
      user,
      pagingDTO.page,
      pagingDTO.pageSize
    )

    return {
      resCode: 'SUCCESS_UPDATE_BOOKMARK',
      message: '성공적으로 북마크 목록을 조회했습니다.',
      data: GetRoadsResponseDTO.fromRoads(getRoadsOrNull),
    }
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(JwtAuthGuard)
  async uploadRoadImages(
    @User() user: Users,
    @UploadedFiles() createImages: Array<MulterFile> | null,
  ): Promise<CommonResponse<CreateRoadImageResponseDTO>> {
    const imageLocations: string[] | null =
      createImages?.map((file: MulterFile) => {
        return `https://${STORAGE_DOMAIN}/${file.key}`;
      }) ?? null;

    const createRoadImages = await this.roadsService.createRoadImages(
      imageLocations,
    );

    const createRoadImageResponseDTO =
      CreateRoadImageResponseDTO.fromRoadImagesArray(createRoadImages);

    return {
      resCode: 'SUCCESS_CREATE_ROAD_IMAGES',
      message: '성공적으로 길 이미지를 업로드했습니다.',
      data: createRoadImageResponseDTO,
    };
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createRoad(
    @User() user: Users,
    @Body(new CategoryValidationPipe(), new PlaceValidationPipe())
    createRoadRequestDto: CreateRoadRequestDTO,
  ): Promise<CommonResponse<CreateRoadResponseDTO>> {
    // 해시태그를 정규식으로 공백 없는 문자열 부분만 필터링합니다.
    const filteredHashtags: string[] | null =
      createRoadRequestDto.hashtags?.map((hashtag) =>
        hashtag.replace(/#|\s/g, '').trim(),
      ) ?? null;

    const createRoad: Roads = await this.roadsService.createRoad(
      user,
      createRoadRequestDto.title,
      createRoadRequestDto.content,
      createRoadRequestDto.distance,
      createRoadRequestDto.placeCode,
      createRoadRequestDto.categoryId,
      {
        routes: createRoadRequestDto.routes,
        spots: createRoadRequestDto.spots,
        images: createRoadRequestDto.images,
        hashtags: filteredHashtags,
      },
    );

    return {
      resCode: 'SUCCESS_CREATE_ROAD',
      message: '성공적으로 길을 생성했습니다.',
      data: CreateRoadResponseDTO.fromRoad(createRoad),
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateRoad(
    @User() user: Users,
    @Param('id') roadId: string,
    @Body() updateRoadRequestDto: UpdateRoadRequestDTO,
  ): Promise<CommonResponse<CreateRoadResponseDTO>> {
    // 해시태그를 정규식으로 공백 없는 문자열 부분만 필터링합니다.
    const filteredHashtags: string[] | null =
      updateRoadRequestDto.hashtags?.map((hashtag) =>
        hashtag.replace(/#|\s/g, '').trim(),
      ) ?? null;

    const updateRoad: Roads = await this.roadsService.updateRoad(
      user,
      Number(roadId),
      updateRoadRequestDto.title,
      updateRoadRequestDto.content,
      updateRoadRequestDto.distance,
      updateRoadRequestDto.placeCode,
      updateRoadRequestDto.categoryId,
      {
        routes: updateRoadRequestDto.routes,
        spots: updateRoadRequestDto.spots,
        images: updateRoadRequestDto.images,
        hashtags: filteredHashtags,
      },
    );

    return {
      resCode: 'SUCCESS_UPDATE_ROAD',
      message: '성공적으로 길을 수정했습니다.',
      data: CreateRoadResponseDTO.fromRoad(updateRoad),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteRoad(
    @User() user: Users,
    @Param('id') roadId: string,
  ): Promise<CommonResponse<boolean>> {
    await this.roadsService.deleteRoad(user, Number(roadId));

    return {
      resCode: 'SUCCESS_DELETE_ROAD',
      message: '성공적으로 길을 삭제했습니다.',
    };
  }

  @Get(':id')
  async getRoadById(
    @Param('id') roadId: string,
  ): Promise<CommonResponse<GetRoadResponseDTO>> {
    const getRoad = await this.roadsService.getRoadById(Number(roadId));

    return {
      resCode: 'SUCCESS_GET_ROAD_BY_ID',
      message: '성공적으로 길을 조회했습니다.',
      data: GetRoadResponseDTO.fromRoad(getRoad),
    };
  }

  @Get('')
  async getRoads(
    @Query() getRoadsRequestDTO: GetRoadsRequestDTO,
  ): Promise<CommonResponse<GetRoadsResponseDTO | null>> {
    const { placeCode, categoryId, lastId, limit, direction } =
      getRoadsRequestDTO;

    let getRoadsOrNull: Roads[] | null = null;
    if (categoryId) {
      getRoadsOrNull = await this.roadsService.getRoadsByCategory(categoryId, {
        direction,
        lastId,
        limit,
      });
    } else if (placeCode) {
      getRoadsOrNull = await this.roadsService.getRoadsByPlaceCode(placeCode, {
        direction,
        lastId,
        limit,
      });
    }

    return {
      resCode: 'SUCCESS_GET_ROADS_BY_ID',
      message: '성공적으로 길을 조회했습니다.',
      data: GetRoadsResponseDTO.fromRoads(getRoadsOrNull),
    };
  }
}
