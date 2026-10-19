import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { SinhVien } from './entities/sinhvien.entity.js';
import { UpdateSinhVienDto } from './dto/update-sinhvien.dto.js';

@Injectable()
export class SinhvienService {
  constructor(
    @InjectRepository(SinhVien)
    private readonly sinhVienRepository: Repository<SinhVien>,
  ) {}

  private toPublicStudent(student: SinhVien) {
    const { MATKHAU: _password, ...publicStudent } = student;
    return publicStudent;
  }

  async findAll() {
    const students = await this.sinhVienRepository.find();

    return students.map((student) => this.toPublicStudent(student));
  }

  async findOne(msv: string) {
    const student = await this.sinhVienRepository.findOne({
      where: { MSV: msv },
    });

    if (!student) {
      throw new NotFoundException(`Không tìm thấy sinh viên có mã ${msv}`);
    }

    return this.toPublicStudent(student);
  }

  async create(data: Partial<SinhVien>) {
    const msv = data.MSV?.trim();
    const name = data.TENSV?.trim();
    const email = data.EMAIL?.trim() || null;

    if (!msv || !name) {
      throw new BadRequestException(
        'Mã sinh viên và tên sinh viên không được để trống',
      );
    }

    const existingStudent = await this.sinhVienRepository.findOne({
      where: { MSV: msv },
    });

    if (existingStudent) {
      throw new BadRequestException('Mã sinh viên đã tồn tại');
    }

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

    if (data.MATKHAU) {
      studentData.MATKHAU = await bcrypt.hash(data.MATKHAU, 10);
    } else {
      studentData.MATKHAU = null;
    }

    const student = this.sinhVienRepository.create(studentData);

    const savedStudent = await this.sinhVienRepository.save(student);

    return this.toPublicStudent(savedStudent);
  }

  async update(msv: string, data: UpdateSinhVienDto) {
    const student = await this.sinhVienRepository.findOne({
      where: { MSV: msv },
    });

    if (!student) {
      throw new NotFoundException(`Không tìm thấy sinh viên có mã ${msv}`);
    }

    const allowedFields = ['KHOA', 'LOP'];

    const invalidFields = Object.keys(data).filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      throw new BadRequestException(
        `Không được phép cập nhật các trường: ${invalidFields.join(', ')}`,
      );
    }

    if (data.KHOA === undefined && data.LOP === undefined) {
      throw new BadRequestException(
        'Vui lòng cung cấp Khoa hoặc Lớp cần cập nhật',
      );
    }

    if (data.KHOA !== undefined) {
      if (data.KHOA !== null && typeof data.KHOA !== 'string') {
        throw new BadRequestException('Khoa phải là chuỗi ký tự');
      }

      if (data.KHOA && data.KHOA.trim().length > 100) {
        throw new BadRequestException('Tên khoa không được quá 100 ký tự');
      }

      student.KHOA = data.KHOA?.trim() || null;
    }

    if (data.LOP !== undefined) {
      if (data.LOP !== null && typeof data.LOP !== 'string') {
        throw new BadRequestException('Lớp phải là chuỗi ký tự');
      }

      if (data.LOP && data.LOP.trim().length > 50) {
        throw new BadRequestException('Tên lớp không được quá 50 ký tự');
      }

      student.LOP = data.LOP?.trim() || null;
    }

    const savedStudent = await this.sinhVienRepository.save(student);

    return this.toPublicStudent(savedStudent);
  }

  async remove(msv: string): Promise<{ message: string }> {
    const student = await this.sinhVienRepository.findOne({
      where: { MSV: msv },
    });

    if (!student) {
      throw new NotFoundException(`Không tìm thấy sinh viên có mã ${msv}`);
    }

    await this.sinhVienRepository.remove(student);

    return {
      message: `Đã xóa sinh viên có mã ${msv}`,
    };
  }
}
