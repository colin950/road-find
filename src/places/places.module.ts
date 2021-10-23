import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { Places } from 'src/entities/places.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Places])],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
