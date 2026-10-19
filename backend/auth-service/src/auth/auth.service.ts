import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { SinhVien } from './entities/sinhvien.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SinhVien)
    private readonly sinhVienRepository: Repository<SinhVien>,

    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const msv = data.MSV.trim();
    const tensv = data.TENSV.trim();
    const email = data.EMAIL.trim();

    const msvExists = await this.sinhVienRepository.findOne({
      where: {
        MSV: msv,
      },
    });

    if (msvExists) {
      throw new BadRequestException('Mã sinh viên đã được sử dụng');
    }

    const emailExists = await this.sinhVienRepository
      .createQueryBuilder('sinhVien')
      .where('LOWER(sinhVien.EMAIL) = LOWER(:email)', {
        email,
      })
      .getOne();

    if (emailExists) {
      throw new BadRequestException('Email đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(data.MATKHAU, 10);

    const sinhVien = this.sinhVienRepository.create({
      MSV: msv,

      TENSV: tensv,

      KHOA: null,

      LOP: null,

      DIEMTB: null,

      EMAIL: email,

      MATKHAU: hashedPassword,

      VAITRO: 'SINHVIEN',
    });

    const savedSinhVien = await this.sinhVienRepository.save(sinhVien);

    return {
      message: 'Đăng ký tài khoản thành công',

      user: {
        MSV: savedSinhVien.MSV,

        TENSV: savedSinhVien.TENSV,

        KHOA: savedSinhVien.KHOA,

        DIEMTB: savedSinhVien.DIEMTB,

        LOP: savedSinhVien.LOP,

        EMAIL: savedSinhVien.EMAIL,

        VAITRO: savedSinhVien.VAITRO,
      },
    };
  }

  async login(data: LoginDto) {
    const email = data.EMAIL.trim();

    const sinhVien = await this.sinhVienRepository
      .createQueryBuilder('sinhVien')

      .addSelect('sinhVien.MATKHAU')

      .where('LOWER(sinhVien.EMAIL) = LOWER(:email)', {
        email,
      })

      .getOne();

    if (!sinhVien || !sinhVien.MATKHAU) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const passwordValid = await bcrypt.compare(data.MATKHAU, sinhVien.MATKHAU);

    if (!passwordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = {
      sub: sinhVien.MSV,

      email: sinhVien.EMAIL,

      role: sinhVien.VAITRO,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Đăng nhập thành công',

      access_token: accessToken,

      user: {
        MSV: sinhVien.MSV,

        TENSV: sinhVien.TENSV,

        KHOA: sinhVien.KHOA,

        DIEMTB: sinhVien.DIEMTB,

        LOP: sinhVien.LOP,

        EMAIL: sinhVien.EMAIL,

        VAITRO: sinhVien.VAITRO,
      },
    };
  }
}
