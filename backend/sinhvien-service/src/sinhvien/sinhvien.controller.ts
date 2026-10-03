import {
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

  // ADMIN - LẤY DANH SÁCH SINH VIÊN
  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.sinhvienService.findAll();
  }

  // ADMIN - LẤY THÔNG TIN SINH VIÊN
  @Get(':msv')
  @Roles('ADMIN')
  findOne(
    @Param('msv') msv: string,
  ) {
    return this.sinhvienService.findOne(msv);
  }

  // ADMIN - TẠO SINH VIÊN
  @Post()
  @Roles('ADMIN')
  create(
    @Body() data: CreateSinhVienDto,
  ) {
    return this.sinhvienService.create(data);
  }

  // ADMIN / SINHVIEN - CẬP NHẬT THÔNG TIN
  @Put(':msv')
  @Roles('ADMIN', 'SINHVIEN')
  update(
    @Param('msv') msv: string,

    @Body()
    data: {
      EMAIL?: string;
      KHOA?: string;
      LOP?: string;
    },

    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user;

    const currentMsv = user.sub;
    const currentRole = user.role;

    // SINHVIEN chỉ được sửa thông tin của chính mình
    if (
      currentRole === 'SINHVIEN' &&
      currentMsv !== msv
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền cập nhật thông tin của sinh viên khác.',
      );
    }

    // Chỉ cho phép cập nhật 3 trường:
    // EMAIL, KHOA, LOP
    const updateData = {
      EMAIL:
        data.EMAIL !== undefined
          ? data.EMAIL.trim()
          : undefined,

      KHOA:
        data.KHOA !== undefined
          ? data.KHOA.trim() || null
          : undefined,

      LOP:
        data.LOP !== undefined
          ? data.LOP.trim() || null
          : undefined,
    };

    return this.sinhvienService.update(
      msv,
      updateData,
    );
  }

  // ADMIN - XÓA SINH VIÊN
  @Delete(':msv')
  @Roles('ADMIN')
  remove(
    @Param('msv') msv: string,
  ) {
    return this.sinhvienService.remove(msv);
  }
}
