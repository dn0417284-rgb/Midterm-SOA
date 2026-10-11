
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { SinhvienService } from './sinhvien.service.js';
import { CreateSinhVienDto } from './dto/create-sinhvien.dto.js';
import { UpdateSinhVienDto } from './dto/update-sinhvien.dto.js';

import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { Roles } from './decorators/roles.decorator.js';

interface JwtUser {
  sub: string;
  email: string;
  role: string;
}

type AuthenticatedRequest = Request & {
  user: JwtUser;
};

@Controller('sinhvien')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SinhvienController {
  constructor(
    private readonly sinhvienService: SinhvienService,
  ) {}

  // ====================================
  // ADMIN - LẤY DANH SÁCH SINH VIÊN
  // ====================================

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.sinhvienService.findAll();
  }

  // ====================================
  // ADMIN / SINHVIEN - XEM THÔNG TIN
  // ====================================

  @Get(':msv')
  @Roles('ADMIN', 'SINHVIEN')
  findOne(
    @Param('msv') msv: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const currentMsv = String(req.user.sub);
    const currentRole = req.user.role;

    // Sinh viên chỉ được xem thông tin của mình
    if (
      currentRole === 'SINHVIEN' &&
      currentMsv !== msv
    ) {
      throw new ForbiddenException(
        'Bạn chỉ được xem thông tin của chính mình.',
      );
    }

    return this.sinhvienService.findOne(msv);
  }

  // ====================================
  // ADMIN - TẠO SINH VIÊN
  // ====================================

  @Post()
  @Roles('ADMIN')
  create(
    @Body() data: CreateSinhVienDto,
  ) {
    return this.sinhvienService.create(data);
  }

  // ====================================
  // ADMIN / SINHVIEN - CẬP NHẬT
  // ====================================

  @Put(':msv')
  @Roles('ADMIN', 'SINHVIEN')
  update(
    @Param('msv') msv: string,
    @Body() data: UpdateSinhVienDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const currentMsv = String(req.user.sub);
    const currentRole = req.user.role;

    // Sinh viên chỉ được cập nhật chính mình
    if (
      currentRole === 'SINHVIEN' &&
      currentMsv !== msv
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền cập nhật thông tin của sinh viên khác.',
      );
    }

    // Chỉ cho phép cập nhật KHOA và LOP
    const allowedFields = ['KHOA', 'LOP'];

    const invalidFields = Object.keys(data).filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      throw new BadRequestException(
        `Không được phép cập nhật các trường: ${invalidFields.join(', ')}`,
      );
    }

    if (
      data.KHOA === undefined &&
      data.LOP === undefined
    ) {
      throw new BadRequestException(
        'Vui lòng cung cấp Khoa hoặc Lớp cần cập nhật.',
      );
    }

    return this.sinhvienService.update(msv, data);
  }

  // ====================================
  // ADMIN - XÓA SINH VIÊN
  // ====================================

  @Delete(':msv')
  @Roles('ADMIN')
  remove(
    @Param('msv') msv: string,
  ) {
    return this.sinhvienService.remove(msv);
  }
}
