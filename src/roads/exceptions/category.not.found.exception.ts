import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoryNotFoundException extends HttpException {
  constructor() {
    super(
      {
        resCode: 'CATEGORY_NOT_FOUND',
        message: '카테고리를 찾을 수 없습니다.',
      },
      HttpStatus.OK,
    );
  }
}
