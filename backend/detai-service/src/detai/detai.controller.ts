import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateDetaiDto, UpdateDetaiDto } from './dto/detai.dto.js';

import { DetaiService } from './detai.service.js';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { Roles } from './auth/decorators/roles.decorator.js';

@Controller('detai')
export class DetaiController {
  constructor(private readonly detaiService: DetaiService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SINHVIEN')
  create(@Body() dto: CreateDetaiDto) {
    return this.detaiService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SINHVIEN')
  findAll() {
    return this.detaiService.findAll();
  }

  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SINHVIEN')
  search(@Query('keyword') keyword: string) {
    return this.detaiService.search(keyword);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SINHVIEN')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detaiService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDetaiDto) {
    return this.detaiService.update(id, dto);
  }

  @Put(':id/internal-status')
  updateInternalStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('trangThai') trangThai: number,
    @Headers('x-internal-key') internalKey: string,
  ) {
    const expectedKey = process.env.INTERNAL_SERVICE_KEY;

    if (!expectedKey || !internalKey || internalKey !== expectedKey) {
      throw new ForbiddenException('Không có quyền cập nhật trạng thái nội bộ');
    }

    if (trangThai !== 0 && trangThai !== 1) {
      throw new BadRequestException('Trạng thái đề tài phải là 0 hoặc 1');
    }

    return this.detaiService.updateStatus(id, trangThai);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.detaiService.remove(id);
  }
}
