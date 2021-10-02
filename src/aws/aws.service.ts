import {Injectable, InternalServerErrorException} from '@nestjs/common'
import * as AWS from 'aws-sdk'
import {ErrorCode} from '../util/interceptors/http-exception.filter'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  private readonly s3
  private bucket

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3()

    AWS.config.update({
      accessKeyId: this.configService.get('aws.id'),
      secretAccessKey: this.configService.get('aws.secret'),
      region: this.configService.get('aws.region')
    })
    this.bucket = this.configService.get('aws.bucket')
  }

  async uploadFromBinary(file) {
    try {
      let params = {
        Bucket: this.bucket,
        ACL: 'public-read',
        Key: `img/${file.name}`
        // 어떤파일로 받을것인가 ?
      }
      const data = await this.s3.upload(params).promise()
      return data
    } catch (err) {
      throw new InternalServerErrorException(ErrorCode.INTERNAL_SERVER_ERROR)
    }

  }
}
