import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { DangkyService } from './dangky.service.js';
import { CreateDangKyDto } from './dto/create-dangky.dto.js';
import { UpdateDangKyDto } from './dto/update-dangky.dto.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { Roles } from './auth/decorators/roles.decorator.js';

interface JwtUser {
  sub: string;
  email: string;
  role: string;
}

type AuthRequest = Request & { user: JwtUser };

@Controller('dangky')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DangkyController {
  constructor(private readonly dangkyService: DangkyService) {}

  // Chỉ cho SINHVIEN thao tác trên dữ liệu của chính mình
  private assertOwner(req: AuthRequest, msv: string) {
    if (req.user.role === 'SINHVIEN' && req.user.sub !== msv) {
      throw new ForbiddenException('Bạn chỉ được thao tác trên đăng ký của mình');
    }
  }

  // ADMIN - tất cả đăng ký
  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.dangkyService.findAll();
  }

  // ADMIN - danh sách sinh viên đăng ký 1 đề tài
  @Get('detai/:detaiId')
  @Roles('ADMIN')
  findByDetai(@Param('detaiId', ParseIntPipe) detaiId: number) {
    return this.dangkyService.findByDetai(detaiId);
  }

  // ADMIN / SINHVIEN - đăng ký của 1 sinh viên
  @Get('sinhvien/:msv')
  @Roles('ADMIN', 'SINHVIEN')
  findBySinhVien(@Param('msv') msv: string, @Req() req: AuthRequest) {
    this.assertOwner(req, msv);
    return this.dangkyService.findBySinhVien(msv);
  }

  // ADMIN / SINHVIEN - chi tiết 1 đăng ký
  @Get(':detaiId/:msv')
  @Roles('ADMIN', 'SINHVIEN')
  findOne(
    @Param('detaiId', ParseIntPipe) detaiId: number,
    @Param('msv') msv: string,
    @Req() req: AuthRequest,
  ) {
    this.assertOwner(req, msv);
    return this.dangkyService.findOne(detaiId, msv);
  }

  // SINHVIEN - tự đăng ký (msv lấy từ token)
  @Post()
  @Roles('SINHVIEN')
  create(@Body() dto: CreateDangKyDto, @Req() req: AuthRequest) {
    return this.dangkyService.create(
      req.user.sub,
      dto.detaiId,
      req.headers.authorization as string,
    );
  }

  // ADMIN - duyệt / từ chối
  @Put(':detaiId/:msv')
  @Roles('ADMIN')
  update(
    @Param('detaiId', ParseIntPipe) detaiId: number,
    @Param('msv') msv: string,
    @Body() dto: UpdateDangKyDto,
    @Req() req: AuthRequest,
  ) {
    return this.dangkyService.update(
      detaiId,
      msv,
      dto,
      req.headers.authorization as string,
    );
  }

  // ADMIN / SINHVIEN - hủy đăng ký
  @Delete(':detaiId/:msv')
  @Roles('ADMIN', 'SINHVIEN')
  remove(
    @Param('detaiId', ParseIntPipe) detaiId: number,
    @Param('msv') msv: string,
    @Req() req: AuthRequest,
  ) {
    this.assertOwner(req, msv);
    return this.dangkyService.remove(
      detaiId,
      msv,
      req.headers.authorization as string,
    );
  }
}