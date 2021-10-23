import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Point, Position } from 'geojson';
import { Places } from 'src/entities/places.entity';

export class GetPlacesResponseDTO {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  fullAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  coords: Position;

  // == Static methods ==
  static fromPlace(place: Places): GetPlacesResponseDTO {
    const getPlacesResponseDTO = new GetPlacesResponseDTO();

    getPlacesResponseDTO.code = place.code;
    getPlacesResponseDTO.fullAddress = place.fullAddress;
    getPlacesResponseDTO.coords = (place.coords as Point).coordinates;

    return getPlacesResponseDTO;
  }
}
