import {ApiProperty} from '@nestjs/swagger'
import {IsNumber, IsOptional} from 'class-validator'
import {Type} from 'class-transformer'

export class PagingDTO {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;
}
