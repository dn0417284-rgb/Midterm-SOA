import { Module } from '@nestjs/common';
import { DangkyController } from './dangky.controller.js';
import { DangkyService } from './dangky.service.js';

@Module({
  controllers: [DangkyController],
  providers: [DangkyService]
})
export class DangkyModule {}
