import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common'
import { Users } from '../entities/users.entity';
import {hashPassword} from '../util/cipher'
import {CreateUsersDTO} from './dto/create.users.dto'

import {randomInt} from 'crypto'
import {RandomGenerator} from 'typeorm/util/RandomGenerator'
import {UserStatus} from './users.type'
import {ErrorCode} from '../http-exception.filter'

@Injectable()
export class UsersService {
  async create(createUsersDto: CreateUsersDTO) {
    const { email, password } = createUsersDto
    const lowerCaseEmail = email.toLowerCase()
    await this.isAvailableEmail(lowerCaseEmail)

    // encode password
    const encryptedPassword = await hashPassword(password)
    const token = randomInt(10000, 99999).toString()

    const userInfo: any = {
      'email': lowerCaseEmail,
      'password': encryptedPassword,
      'status': UserStatus.REGISTERED,
      'token': token
    }
    await Users.createUser(userInfo);
    // 이메일을 보내야하는가?
    // 보내야한다면 이메일 양식 템플릿 작성
    return
  }

  private async isAvailableEmail(email: string) {
    const user = await Users.findByEmail(email)
    if (user) throw new BadRequestException(ErrorCode.ALREADY_EXIST_EMAIL)

    return true
  }
}
