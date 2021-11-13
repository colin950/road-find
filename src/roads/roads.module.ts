import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { RoadsService } from './roads.service';
import { RoadsController } from './roads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Roads } from 'src/entities/roads.entity';
import { Places } from 'src/entities/places.entity';
import { Categories } from 'src/entities/categories.entity';
import { HashTags } from 'src/entities/hashtags.entity';
import { RoadAnalytics } from 'src/entities/road.analytics.entity';
import { RoadSpots } from 'src/entities/road.spots.entity';
import { RoadImages } from 'src/entities/road.images.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const storages = {
          s3: () => {
            const s3 = new AWS.S3();

            AWS.config.update({
              accessKeyId: configService.get('aws.id'),
              secretAccessKey: configService.get('aws.secret'),
              region: configService.get('aws.region'),
            });

            return multerS3({
              s3: s3,
              bucket: configService.get('aws.bucket'),
              acl: 'public-read',
              contentType: multerS3.AUTO_CONTENT_TYPE,
              key: (request, file, callback) => {
                const randomUUIDFileName = randomStringGenerator();
                const fileExtension = file.originalname
                  .split('.')
                  .pop()
                  .toLowerCase();

                const today = new Date();

                const yearString = `${today.getFullYear()}`;
                const monthString = `${today.getMonth() + 1}`.padStart(2, '0');
                const dayString = `${today.getDate()}`.padStart(2, '0');

                const todayString = `${yearString}-${monthString}-${dayString}`;

                const fileName = `roadImages/${todayString}/${randomUUIDFileName}.${fileExtension}`;
                callback(null, fileName);
              },
            });
          },
        };

        return {
          fileFilter: (request, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
              return callback(
                new HttpException(
                  {
                    resCode: 'INVALID_FILE_EXTENSION',
                    message: '이미지 파일 확장자를 확인해 주세요.',
                  },
                  HttpStatus.OK,
                ),
                false,
              );
            }

            callback(null, true);
          },
          storage: storages.s3(),
          limits: {
            fileSize: 10485760, // 10MB
          },
        };
      },
    }),
    TypeOrmModule.forFeature([
      Users,
      Roads,
      Places,
      Categories,
      HashTags,
      RoadAnalytics,
      RoadSpots,
      RoadImages,
    ]),
  ],
  providers: [RoadsService],
  controllers: [RoadsController],
})
export class RoadsModule {}
