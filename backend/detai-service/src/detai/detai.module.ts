import { Module } from '@nestjs/common';
import { DetaiController } from './detai.controller.js';
import { DetaiService } from './detai.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detai } from './entities/detai.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Detai])],
  controllers: [DetaiController],
  providers: [DetaiService],
})
export class DetaiModule {}
