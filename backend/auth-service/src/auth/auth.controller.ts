import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { Roles } from './decorators/roles.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // =========================
  // REGISTER
  // =========================

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  // =========================
  // LOGIN
  // =========================

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  // =========================
  // TEST JWT
  // =========================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(
    @Req() request: Request & { user: any },
  ) {
    return {
      message: 'Token hợp lệ',
      user: request.user,
    };
  }

  // =========================
  // TEST ADMIN
  // =========================

  @Get('admin-test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  adminTest(
    @Req() request: Request & { user: any },
  ) {
    return {
      message: 'Bạn có quyền ADMIN',
      user: request.user,
    };
  }

  // =========================
  // TEST SINH VIÊN
  // =========================

  @Get('student-test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SINHVIEN')
  studentTest(
    @Req() request: Request & { user: any },
  ) {
    return {
      message: 'Bạn có quyền SINHVIEN',
      user: request.user,
    };
  }
}