import { Module } from '@nestjs/common';
import {AwsService} from './aws.service'
import {ConfigService} from '@nestjs/config'
@Module({
  providers: [
    AwsService,
    {
      provide: 'ACCESS_KEY_ID',
      useValue: 'AKIAVGZBBWX4TNNLA6VR'
      // useValue: configuration().aws.id
    },
    {
      provide: 'SECRET_ACCESS_KEY',
      useValue: 'YjRGvRaciDzo4gEQbrnHw1PgqPQhrQBb89cpEttO'
    },
    {
      provide: 'REGION',
      useValue: 'ap-northeast-2'
    },
    {
      provide: 'BUCKET',
      useValue: 'mashup-road-public'
    },
  ]
})
export class AwsModule {}
