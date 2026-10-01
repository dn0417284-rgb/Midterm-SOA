import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { SinhvienService } from './sinhvien.service.js';
import { CreateSinhVienDto } from './dto/create-sinhvien.dto.js';

import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { Roles } from './decorators/roles.decorator.js';

@Controller('sinhvien')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class SinhvienController {
  constructor(
    private readonly sinhvienService: SinhvienService,
  ) {}

  @Get()
  findAll() {
    return this.sinhvienService.findAll();
  }

  @Get(':msv')
  findOne(
    @Param('msv') msv: string,
  ) {
    return this.sinhvienService.findOne(msv);
  }

  @Post()
  create(
    @Body() data: CreateSinhVienDto,
  ) {
    return this.sinhvienService.create(data);
  }

  @Put(':msv')
  update(
    @Param('msv') msv: string,
    @Body() data: Partial<CreateSinhVienDto>,
  ) {
    return this.sinhvienService.update(
      msv,
      data,
    );
  }

  @Delete(':msv')
  remove(
    @Param('msv') msv: string,
  ) {
    return this.sinhvienService.remove(msv);
  }
}