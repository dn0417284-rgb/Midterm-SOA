import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { DangkyService } from './dangky.service.js';
import { CreateDangKyDto } from './dto/create-dangky.dto.js';
import { UpdateDangKyDto } from './dto/update-dangky.dto.js';

@Controller('dangky')
export class DangkyController {
  constructor(
    private readonly dangkyService: DangkyService,
  ) {}

  @Get()
  findAll() {
    return this.dangkyService.findAll();
  }

  @Get('sinhvien/:msv')
  findBySinhVien(
    @Param('msv') msv: string,
  ) {
    return this.dangkyService.findBySinhVien(msv);
  }

  @Get('detai/:detaiId')
  findByDetai(
    @Param('detaiId', ParseIntPipe) detaiId: number,
  ) {
    return this.dangkyService.findByDetai(detaiId);
  }

  @Get(':detaiId/:msv')
  findOne(
    @Param('detaiId', ParseIntPipe) detaiId: number,
    @Param('msv') msv: string,
  ) {
    return this.dangkyService.findOne(
      detaiId,
      msv,
    );
  }

  @Post()
  create(
    @Body() dto: CreateDangKyDto,
  ) {
    return this.dangkyService.create(dto);
  }

  @Put(':detaiId/:msv')
  update(
    @Param('detaiId', ParseIntPipe) detaiId: number,
    @Param('msv') msv: string,
    @Body() dto: UpdateDangKyDto,
  ) {
    return this.dangkyService.update(
      detaiId,
      msv,
      dto,
    );
  }

  @Delete(':detaiId/:msv')
  remove(
    @Param('detaiId', ParseIntPipe) detaiId: number,
    @Param('msv') msv: string,
  ) {
    return this.dangkyService.remove(
      detaiId,
      msv,
    );
  }
}