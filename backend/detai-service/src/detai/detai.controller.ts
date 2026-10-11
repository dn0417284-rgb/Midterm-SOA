
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

import {
  CreateDetaiDto,
  UpdateDetaiDto,
} from './dto/detai.dto.js';

import { DetaiService } from './detai.service.js';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { Roles } from './auth/decorators/roles.decorator.js';

@Controller('detai')
export class DetaiController {
  constructor(
    private readonly detaiService: DetaiService,
  ) {}

  // ====================================
  // THÊM ĐỀ TÀI
  // ====================================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SINHVIEN')
  create(@Body() dto: CreateDetaiDto) {
    return this.detaiService.create(dto);
  }

  // ====================================
  // LẤY DANH SÁCH ĐỀ TÀI
  // ====================================

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SINHVIEN')
  findAll() {
    return this.detaiService.findAll();
  }

  // ====================================
  // TÌM KIẾM ĐỀ TÀI
  // ====================================

  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SINHVIEN')
  search(@Query('keyword') keyword: string) {
    return this.detaiService.search(keyword);
  }

  // ====================================
  // XEM CHI TIẾT ĐỀ TÀI
  // ====================================

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SINHVIEN')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detaiService.findOne(id);
  }

  // ====================================
  // CẬP NHẬT ĐỀ TÀI - ADMIN
  // ====================================

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDetaiDto,
  ) {
    return this.detaiService.update(id, dto);
  }

  // ====================================
  // CẬP NHẬT TRẠNG THÁI - ADMIN
  // ====================================

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('trangThai') trangThai: number,
  ) {
    if (trangThai !== 0 && trangThai !== 1) {
      throw new BadRequestException(
        'Trạng thái đề tài phải là 0 hoặc 1',
      );
    }

    return this.detaiService.updateStatus(id, trangThai);
  }

  // ====================================
  // CẬP NHẬT TRẠNG THÁI NỘI BỘ
  // CHỈ DÀNH CHO DANGKY SERVICE
  // ====================================

  @Put(':id/internal-status')
  updateInternalStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('trangThai') trangThai: number,
    @Headers('x-internal-key') internalKey: string,
  ) {
    const expectedKey = process.env.INTERNAL_SERVICE_KEY;

    if (!expectedKey || !internalKey || internalKey !== expectedKey) {
      throw new ForbiddenException(
        'Không có quyền cập nhật trạng thái nội bộ',
      );
    }

    if (trangThai !== 0 && trangThai !== 1) {
      throw new BadRequestException(
        'Trạng thái đề tài phải là 0 hoặc 1',
      );
    }

    return this.detaiService.updateStatus(id, trangThai);
  }

  // ====================================
  // XÓA ĐỀ TÀI - ADMIN
  // ====================================

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.detaiService.remove(id);
  }
}
