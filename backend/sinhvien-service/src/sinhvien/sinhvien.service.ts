
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { SinhVien } from './entities/sinhvien.entity.js';

@Injectable()
export class SinhvienService {
  constructor(
    @InjectRepository(SinhVien)
    private readonly sinhVienRepository: Repository<SinhVien>,
  ) {}

  // Không trả mật khẩu cho frontend.
  private toPublicStudent(student: SinhVien) {
    const { MATKHAU: _password, ...publicStudent } = student;
    return publicStudent;
  }

  // GET /sinhvien
  async findAll() {
    const students = await this.sinhVienRepository.find();

    return students.map((student) =>
      this.toPublicStudent(student),
    );
  }

  // GET /sinhvien/:msv
  async findOne(msv: string) {
    const student = await this.sinhVienRepository.findOne({
      where: { MSV: msv },
    });

    if (!student) {
      throw new NotFoundException(
        `Không tìm thấy sinh viên có mã ${msv}`,
      );
    }

    return this.toPublicStudent(student);
  }

  // POST /sinhvien
  async create(data: Partial<SinhVien>) {
    const msv = data.MSV?.trim();
    const name = data.TENSV?.trim();
    const email = data.EMAIL?.trim() || null;

    if (!msv || !name) {
      throw new BadRequestException(
        'Mã sinh viên và tên sinh viên không được để trống',
      );
    }

    // Kiểm tra trùng mã sinh viên.
    const existingStudent = await this.sinhVienRepository.findOne({
      where: { MSV: msv },
    });

    if (existingStudent) {
      throw new BadRequestException('Mã sinh viên đã tồn tại');
    }

    // Kiểm tra trùng email, không phân biệt chữ hoa/chữ thường.
    if (email) {
      const existingEmail = await this.sinhVienRepository
        .createQueryBuilder('sinhVien')
        .where('LOWER(sinhVien.EMAIL) = LOWER(:email)', {
          email,
        })
        .getOne();

      if (existingEmail) {
        throw new BadRequestException('Email đã được sử dụng');
      }
    }

    const studentData: Partial<SinhVien> = {
      ...data,
      MSV: msv,
      TENSV: name,
      KHOA: data.KHOA?.trim() || null,
      LOP: data.LOP?.trim() || null,
      EMAIL: email,
      VAITRO: 'SINHVIEN',
    };

    // Hash mật khẩu trước khi lưu.
    if (data.MATKHAU) {
      studentData.MATKHAU = await bcrypt.hash(
        data.MATKHAU,
        10,
      );
    } else {
      studentData.MATKHAU = null;
    }

    const student = this.sinhVienRepository.create(studentData);
    const savedStudent = await this.sinhVienRepository.save(student);

    return this.toPublicStudent(savedStudent);
  }

  // PUT /sinhvien/:msv
  async update(msv: string, data: Partial<SinhVien>) {
    const student = await this.sinhVienRepository.findOne({
      where: { MSV: msv },
    });

    if (!student) {
      throw new NotFoundException(
        `Không tìm thấy sinh viên có mã ${msv}`,
      );
    }

    if (data.EMAIL !== undefined) {
      const email = data.EMAIL?.trim() || null;

      // Kiểm tra email đã thuộc sinh viên khác chưa.
      if (email) {
        const existingEmail = await this.sinhVienRepository
          .createQueryBuilder('sinhVien')
          .where('LOWER(sinhVien.EMAIL) = LOWER(:email)', {
            email,
          })
          .andWhere('sinhVien.MSV != :msv', { msv })
          .getOne();

        if (existingEmail) {
          throw new BadRequestException('Email đã được sử dụng');
        }
      }

      student.EMAIL = email;
    }

    if (data.KHOA !== undefined) {
      student.KHOA = data.KHOA?.trim() || null;
    }

    if (data.LOP !== undefined) {
      student.LOP = data.LOP?.trim() || null;
    }

    const savedStudent = await this.sinhVienRepository.save(student);

    return this.toPublicStudent(savedStudent);
  }

  // DELETE /sinhvien/:msv
  async remove(msv: string): Promise<{ message: string }> {
    const student = await this.sinhVienRepository.findOne({
      where: { MSV: msv },
    });

    if (!student) {
      throw new NotFoundException(
        `Không tìm thấy sinh viên có mã ${msv}`,
      );
    }

    await this.sinhVienRepository.remove(student);

    return {
      message: `Đã xóa sinh viên có mã ${msv}`,
    };
  }
}
