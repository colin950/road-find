import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import { Users } from '../entities/users.entity';
import {hashPassword} from '../util/cipher'
import {CreateUserDTO} from './users.dto'

import {randomInt} from 'crypto'
import {RandomGenerator} from 'typeorm/util/RandomGenerator'
import {UserStatus} from './users.type'

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDTO) {
    const { email, password, name } = createUserDto
    const lowerCaseEmail = email.toLowerCase()
    await this.isAvailableEmail(lowerCaseEmail)

    // encode password
    const encryptedPassword = await hashPassword(password)
    const token = randomInt(16).toString()

    const userInfo: any = {
      'email': lowerCaseEmail,
      'password': encryptedPassword,
      'name': name,
      'status': UserStatus.REGISTERED,
      'token': token
    }

    const data = await Users.createUser(userInfo);

    // 이메일을 보내야하는가?
    // 보내야한다면 이메일 양식 템플릿 작성
    return data;
  }

  private async isAvailableEmail(email: string) {
    const user = await Users.findByEmail(email)

    if (user) throw new HttpException({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      error: 'already exits email',
    }, HttpStatus.SERVICE_UNAVAILABLE)

    return true
  }
}
