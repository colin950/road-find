import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { Roads } from 'src/entities/roads.entity';
import { Users } from 'src/entities/users.entity';
import { GetRoadResponseDTO } from './get-road.response.dto';

export class GetRoadsResponseDTO {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetRoadResponseDTO)
  roads: GetRoadResponseDTO[] | null;

  // == Static methods ==
  static fromRoads(
    roads: Roads[] | null,
    userOrNull: Users | null,
  ): GetRoadsResponseDTO {
    const newRoadsResponseDTO = new GetRoadsResponseDTO();

    const getRoadResponseDTOs = roads?.map((road: Roads) =>
      GetRoadResponseDTO.fromRoad(road, userOrNull),
    );

    newRoadsResponseDTO.roads = getRoadResponseDTOs ?? null;

    return newRoadsResponseDTO;
  }
}
