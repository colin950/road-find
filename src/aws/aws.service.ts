import {Inject, Injectable, InternalServerErrorException} from '@nestjs/common'
import * as AWS from 'aws-sdk'
import {ErrorCode} from '../http-exception.filter'

@Injectable()
export class AwsService {
  private readonly s3

  constructor(
    @Inject('ACCESS_KEY_ID') private readonly accessKeyId,
    @Inject('SECRET_ACCESS_KEY') private readonly secretAccessKey,
    @Inject('REGION') private readonly region,
    @Inject('BUCKET') private readonly bucket,
  ) {
    AWS.config.update({ accessKeyId, secretAccessKey, region})
    this.s3 = new AWS.S3()
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
