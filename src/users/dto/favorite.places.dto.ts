import { IsArray, IsString } from 'class-validator';
import { Point, Position } from 'geojson';
import { Places } from 'src/entities/places.entity';

export class FavoritePlacesDTO {
  @IsString()
  code: string;

  @IsString()
  fullAddress: string;

  @IsArray()
  coords: Position;

  // == Static methods ==
  static fromPlaces(place: Places): FavoritePlacesDTO {
    const favoritePlacesDTO = new FavoritePlacesDTO();

    favoritePlacesDTO.code = place.code;
    favoritePlacesDTO.fullAddress = place.fullAddress;
    favoritePlacesDTO.coords = (place.coords as Point).coordinates;

    return favoritePlacesDTO;
  }
}
