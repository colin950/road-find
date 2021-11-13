import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './auth/auth.module';
import { AwsService } from './aws/aws.service';
import { AwsModule } from './aws/aws.module';
import { RoadsModule } from './roads/roads.module';
import { PlacesModule } from './places/places.module';
import { CategoriesModule } from './categories/categories.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        schema: configService.get('database.schema'),
        entities: [__dirname + '/**/*.entity.{js,ts}'],
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: false,
        timezone: 'Asia/Seoul',
      }),
    }),
    UsersModule,
    AuthModule,
    AwsModule,
    RoadsModule,
    PlacesModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AwsService],
})
export class AppModule {}
