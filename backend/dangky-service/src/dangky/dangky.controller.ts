import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { DangkyService } from './dangky.service.js';
import { CreateDangKyDto } from './dto/create-dangky.dto.js';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { Roles } from './auth/decorators/roles.decorator.js';

interface JwtUser {
  sub: string;
  email: string;
  role: string;
}

type AuthRequest = Request & {
  user: JwtUser;
};

@Controller('dangky')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DangkyController {
  constructor(private readonly dangkyService: DangkyService) {}

  private assertOwner(req: AuthRequest, msv: string) {
    if (req.user.role === 'SINHVIEN' && req.user.sub !== msv) {
      throw new ForbiddenException(
        'Bạn chỉ được thao tác trên đăng ký của mình',
      );
    }
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.dangkyService.findAll();
  }

  @Get('detai/:detaiId')
  @Roles('ADMIN')
  findByDetai(
    @Param('detaiId', ParseIntPipe)
    detaiId: number,
  ) {
    return this.dangkyService.findByDetai(detaiId);
  }

  @Get('sinhvien/:msv')
  @Roles('ADMIN', 'SINHVIEN')
  findBySinhVien(@Param('msv') msv: string, @Req() req: AuthRequest) {
    this.assertOwner(req, msv);

    return this.dangkyService.findBySinhVien(msv);
  }

  @Get(':detaiId/:msv')
  @Roles('ADMIN', 'SINHVIEN')
  findOne(
    @Param('detaiId', ParseIntPipe)
    detaiId: number,

    @Param('msv')
    msv: string,

    @Req()
    req: AuthRequest,
  ) {
    this.assertOwner(req, msv);

    return this.dangkyService.findOne(detaiId, msv);
  }

  @Post()
  @Roles('SINHVIEN')
  create(@Body() dto: CreateDangKyDto, @Req() req: AuthRequest) {
    return this.dangkyService.create(
      req.user.sub,
      dto.detaiId,
      req.headers.authorization as string,
    );
  }

  @Delete(':detaiId/:msv')
  @Roles('ADMIN', 'SINHVIEN')
  remove(
    @Param('detaiId', ParseIntPipe)
    detaiId: number,

    @Param('msv')
    msv: string,

    @Req()
    req: AuthRequest,
  ) {
    this.assertOwner(req, msv);

    return this.dangkyService.remove(
      detaiId,
      msv,
      req.headers.authorization as string,
    );
  }
}
