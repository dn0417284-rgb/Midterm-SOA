import { Module } from '@nestjs/common';
import { DetaiController } from './detai.controller.js';
import { DetaiService } from './detai.service.js';

@Module({
  controllers: [DetaiController],
  providers: [DetaiService]
})
export class DetaiModule {}
