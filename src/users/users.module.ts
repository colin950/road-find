import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { Users } from '../entities/users.entity';
import { MailTokens } from 'src/entities/mail.tokens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, MailTokens]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
