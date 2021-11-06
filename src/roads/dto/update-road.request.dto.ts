import { PartialType } from '@nestjs/swagger';
import { CreateRoadRequestDTO } from './create-road.request.dto';

export class UpdateRoadRequestDTO extends PartialType(CreateRoadRequestDTO) {}
