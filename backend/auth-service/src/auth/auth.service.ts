
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


  // =========================
  // ĐĂNG KÝ
  // =========================

  async register(data: RegisterDto) {
    const msv = data.MSV.trim();

    const tensv = data.TENSV.trim();

    const email = data.EMAIL.trim();


    // =========================
    // KIỂM TRA MSV
    // =========================

    const msvExists =
      await this.sinhVienRepository.findOne({
        where: {
          MSV: msv,
        },
      });

    if (msvExists) {
      throw new BadRequestException(
        'Mã sinh viên đã được sử dụng',
      );
    }


    // =========================
    // KIỂM TRA EMAIL
    // Không phân biệt hoa / thường
    // =========================

    const emailExists =
      await this.sinhVienRepository
        .createQueryBuilder('sinhVien')
        .where(
          'LOWER(sinhVien.EMAIL) = LOWER(:email)',
          {
            email,
          },
        )
        .getOne();

    if (emailExists) {
      throw new BadRequestException(
        'Email đã được sử dụng',
      );
    }


    // =========================
    // HASH MẬT KHẨU
    // =========================

    const hashedPassword =
      await bcrypt.hash(
        data.MATKHAU,
        10,
      );


    // =========================
    // TẠO TÀI KHOẢN SINH VIÊN
    // =========================

    const sinhVien =
      this.sinhVienRepository.create({
        MSV: msv,

        TENSV: tensv,

        // Chưa nhập khi đăng ký
        KHOA: null,

        LOP: null,

        // Chưa có điểm
        DIEMTB: null,

        // Email do người dùng tự nhập
        // Không liên quan đến MSV
        EMAIL: email,

        // Lưu password dạng bcrypt hash
        MATKHAU: hashedPassword,

        // Tài khoản mới mặc định là sinh viên
        VAITRO: 'SINHVIEN',
      });


    const savedSinhVien =
      await this.sinhVienRepository.save(
        sinhVien,
      );


    return {
      message:
        'Đăng ký tài khoản thành công',

      user: {
        MSV: savedSinhVien.MSV,

        TENSV: savedSinhVien.TENSV,

        EMAIL: savedSinhVien.EMAIL,

        VAITRO: savedSinhVien.VAITRO,
      },
    };
  }


  // =========================
  // ĐĂNG NHẬP
  // =========================

  async login(data: LoginDto) {

    // Xóa khoảng trắng đầu/cuối
    const email = data.EMAIL.trim();


    // =========================
    // TÌM SINH VIÊN
    // =========================
    //
    // MATKHAU trong Entity có:
    //
    // select: false
    //
    // nên bắt buộc phải dùng addSelect()
    // để lấy password hash.
    //
    // LOWER() giúp email không phân biệt
    // chữ hoa / chữ thường.
    //
    // Ví dụ:
    // Test@gmail.com
    // test@gmail.com
    // TEST@GMAIL.COM
    //
    // đều có thể tìm được cùng tài khoản.
    // =========================

    const sinhVien =
      await this.sinhVienRepository
        .createQueryBuilder('sinhVien')

        .addSelect(
          'sinhVien.MATKHAU',
        )

        .where(
          'LOWER(sinhVien.EMAIL) = LOWER(:email)',
          {
            email,
          },
        )

        .getOne();


    // =========================
    // KHÔNG TÌM THẤY TÀI KHOẢN
    // =========================

    if (
      !sinhVien ||
      !sinhVien.MATKHAU
    ) {
      throw new UnauthorizedException(
        'Email hoặc mật khẩu không đúng',
      );
    }


    // =========================
    // KIỂM TRA MẬT KHẨU
    // =========================

    const passwordValid =
      await bcrypt.compare(
        data.MATKHAU,
        sinhVien.MATKHAU,
      );


    if (!passwordValid) {
      throw new UnauthorizedException(
        'Email hoặc mật khẩu không đúng',
      );
    }


    // =========================
    // TẠO JWT PAYLOAD
    // =========================

    const payload = {
      sub: sinhVien.MSV,

      email: sinhVien.EMAIL,

      role: sinhVien.VAITRO,
    };


    // =========================
    // TẠO ACCESS TOKEN
    // =========================

    const accessToken =
      await this.jwtService.signAsync(
        payload,
      );


    // =========================
    // TRẢ KẾT QUẢ
    // =========================

    return {
      message:
        'Đăng nhập thành công',

      access_token: accessToken,

      user: {
        MSV: sinhVien.MSV,

        TENSV: sinhVien.TENSV,

        EMAIL: sinhVien.EMAIL,

        VAITRO: sinhVien.VAITRO,
      },
    };
  }
}
