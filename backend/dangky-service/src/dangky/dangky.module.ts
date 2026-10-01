import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { DangkyController } from './dangky.controller.js';
import { DangkyService } from './dangky.service.js';
import { DangKy } from './entities/dangky.entity.js';

@Module({

  imports: [
    TypeOrmModule.forFeature([DangKy]),
    HttpModule,
  ],
  controllers: [DangkyController],
  providers: [DangkyService],
  exports: [DangkyService],
})
export class DangkyModule {}
