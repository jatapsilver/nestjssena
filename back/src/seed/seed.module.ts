import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { SeedRepository } from './seed.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/cateogires.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [SeedController],
  providers: [SeedService, SeedRepository],
})
export class SeedModule {}
