import { Module } from '@nestjs/common';
import { SinhvienController } from './sinhvien.controller.js';
import { SinhvienService } from './sinhvien.service.js';

@Module({
  controllers: [SinhvienController],
  providers: [SinhvienService]
})
export class SinhvienModule {}
