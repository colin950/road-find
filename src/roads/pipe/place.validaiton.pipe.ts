import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Places } from 'src/entities/places.entity';
import { PlaceNotFoundException } from '../exceptions/place.not.found.exception';

@Injectable()
export class PlaceValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { placeCode } = value;
    const place = await Places.findOne(placeCode);

    if (!place) {
      throw new PlaceNotFoundException();
    }

    return value;
  }
}
