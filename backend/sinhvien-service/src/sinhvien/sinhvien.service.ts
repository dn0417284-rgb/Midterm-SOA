import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SinhVien } from './entities/sinhvien.entity.js';

@Injectable()
export class SinhvienService {
  constructor(
    @InjectRepository(SinhVien)
    private readonly sinhVienRepository: Repository<SinhVien>,
  ) {}

  // GET /sinhvien
  async findAll(): Promise<SinhVien[]> {
    return this.sinhVienRepository.find();
  }

  // GET /sinhvien/:msv
  async findOne(msv: string): Promise<SinhVien> {
    const sinhVien = await this.sinhVienRepository.findOne({
      where: {
        MSV: msv,
      },
    });

    if (!sinhVien) {
      throw new NotFoundException(
        `Không tìm thấy sinh viên có mã ${msv}`,
      );
    }

    return sinhVien;
  }

  // POST /sinhvien
  async create(data: Partial<SinhVien>): Promise<SinhVien> {
    const sinhVien = this.sinhVienRepository.create(data);

    return this.sinhVienRepository.save(sinhVien);
  }

  // PUT /sinhvien/:msv
  async update(
    msv: string,
    data: Partial<SinhVien>,
  ): Promise<SinhVien> {
    const sinhVien = await this.findOne(msv);

    Object.assign(sinhVien, data);

    return this.sinhVienRepository.save(sinhVien);
  }

  // DELETE /sinhvien/:msv
  async remove(msv: string): Promise<{ message: string }> {
    const sinhVien = await this.findOne(msv);

    await this.sinhVienRepository.remove(sinhVien);

    return {
      message: `Đã xóa sinh viên có mã ${msv}`,
    };
  }
}