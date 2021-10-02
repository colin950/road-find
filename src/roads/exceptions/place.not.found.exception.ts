import { HttpException, HttpStatus } from '@nestjs/common';

export class PlaceNotFoundException extends HttpException {
  constructor() {
    super(
      {
        resCode: 'PLACE_NOT_FOUND',
        message: '주소를 찾을 수 없습니다.',
      },
      HttpStatus.OK,
    );
  }
}
