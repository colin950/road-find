import { Controller, Get, Query } from '@nestjs/common';
import { Position } from 'geojson';
import { PlacesService } from './places.service';
import { CommonResponse } from 'src/util/interceptors/common.response.interceptor';
import { GetPlacesResponseDTO } from './dto/get.places.response.dto';
import { GetPlacesRequestDTO } from './dto/get.places.request.dto';
import { Places } from 'src/entities/places.entity';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  async getPlaces(
    @Query() getPlacesRequestDTO: GetPlacesRequestDTO,
  ): Promise<CommonResponse<GetPlacesResponseDTO[]>> {
    let getPlaces: Places[] = [];

    let position: Position | undefined = undefined;
    if (getPlacesRequestDTO.position_x && getPlacesRequestDTO.position_y) {
      position = [
        getPlacesRequestDTO.position_x,
        getPlacesRequestDTO.position_y,
      ];

      getPlaces = await this.placesService.getNearestPlacesByPosition(
        position,
        getPlacesRequestDTO.page,
        getPlacesRequestDTO.pageSize,
      );
    }

    if (getPlacesRequestDTO.keyword) {
      getPlaces = await this.placesService.findPlacesByName(
        getPlacesRequestDTO.keyword,
        getPlacesRequestDTO.page,
        getPlacesRequestDTO.pageSize,
      );
    }

    if (getPlacesRequestDTO.keyword && getPlaces.length === 0) {
      getPlaces = await this.placesService.findPlacesByFullAddress(
        getPlacesRequestDTO.keyword,
        getPlacesRequestDTO.page,
        getPlacesRequestDTO.pageSize,
      );
    }

    const getPlacesReponseDTO: GetPlacesResponseDTO[] =
      getPlaces?.map((place) => {
        return GetPlacesResponseDTO.fromPlace(place);
      }) ?? [];

    return {
      resCode: 'SUCCESS_GET_PLACES',
      message: '성공적으로 주소 정보를 조회했습니다.',
      data: getPlacesReponseDTO,
    };
  }
}
