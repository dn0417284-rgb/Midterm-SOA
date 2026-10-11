import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { DangKy } from './entities/dangky.entity.js';
import { CreateDangKyDto } from './dto/create-dangky.dto.js';
import { UpdateDangKyDto } from './dto/update-dangky.dto.js';

@Injectable()
export class DangkyService {
  private readonly sinhVienUrl =
    process.env.SINHVIEN_SERVICE_URL ?? 'http://localhost:3001';

  private readonly deTaiUrl =
    process.env.DETAI_SERVICE_URL ?? 'http://localhost:3002';

  constructor(
    @InjectRepository(DangKy)
    private readonly dangKyRepository: Repository<DangKy>,

    private readonly httpService: HttpService,
  ) {}

  /**
   * Lấy tất cả đăng ký
   */
  async findAll(): Promise<DangKy[]> {
    return this.dangKyRepository.find();
  }

  /**
   * Lấy một đăng ký theo đề tài + sinh viên
   */
  async findOne(
    detaiId: number,
    msv: string,
  ): Promise<DangKy> {
    const dangKy = await this.dangKyRepository.findOne({
      where: {
        DETAI_ID: detaiId,
        MSV: msv,
      },
    });

    if (!dangKy) {
      throw new NotFoundException(
        `Không tìm thấy đăng ký của sinh viên ${msv} với đề tài ${detaiId}`,
      );
    }

    return dangKy;
  }

  /**
   * Lấy danh sách đề tài mà sinh viên đã đăng ký
   */
  async findBySinhVien(msv: string): Promise<DangKy[]> {
    return this.dangKyRepository.find({
      where: {
        MSV: msv,
      },
    });
  }

  /**
   * Lấy danh sách sinh viên đăng ký một đề tài
   */
  async findByDetai(detaiId: number): Promise<DangKy[]> {
    return this.dangKyRepository.find({
      where: {
        DETAI_ID: detaiId,
      },
    });
  }

  /**
   * Gọi SINHVIEN Service để kiểm tra sinh viên
   */
  private async validateSinhVien(msv: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.sinhVienUrl}/sinhvien/${encodeURIComponent(msv)}`,
      ));

      return response.data;
    } catch {
      throw new BadRequestException(
        `Không thể xác thực sinh viên ${msv}`,
      );
    }
  }

  /**
   * Gọi DETAI Service để kiểm tra đề tài
   */
  private async validateDeTai(detaiId: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.deTaiUrl}/detai/${detaiId}`,
        ),
      );

      return response.data;
    } catch {
      throw new BadRequestException(
        `Không thể xác thực đề tài ${detaiId}`,
      );
    }
  }

  /**
   * Đăng ký đề tài
   */
  async create(dto: CreateDangKyDto): Promise<DangKy> {
    // 1. Kiểm tra sinh viên thông qua SINHVIEN Service
    await this.validateSinhVien(dto.msv);

    // 2. Kiểm tra đề tài thông qua DETAI Service
    const deTai = await this.validateDeTai(dto.detaiId);

    // 3. Kiểm tra trạng thái đề tài
    if (
      deTai.trangThai &&
      deTai.trangThai !== 'MO'
    ) {
      throw new BadRequestException(
        'Đề tài hiện không mở đăng ký',
      );
    }

    // 4. Kiểm tra đăng ký trùng
    const existing = await this.dangKyRepository.findOne({
      where: {
        MSV: dto.msv,
        DETAI_ID: dto.detaiId,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Sinh viên đã đăng ký đề tài này',
      );
    }

    // 5. Tạo đăng ký
    const dangKy = this.dangKyRepository.create({
      MSV: dto.msv,
      DETAI_ID: dto.detaiId,
      NGAY_DANG_KY: new Date(),
      TRANG_THAI: 'CHO_DUYET',
    });

    return this.dangKyRepository.save(dangKy);
  }

  /**
   * Cập nhật trạng thái đăng ký
   */
  async update(
    detaiId: number,
    msv: string,
    dto: UpdateDangKyDto,
  ): Promise<DangKy> {
    const dangKy = await this.findOne(
      detaiId,
      msv,
    );

    if (dto.trangThai !== undefined) {
      dangKy.TRANG_THAI = dto.trangThai;
    }

    return this.dangKyRepository.save(dangKy);
  }

  /**
   * Xóa đăng ký
   */
  async remove(
    detaiId: number,
    msv: string,
  ): Promise<{ deleted: boolean }> {
    const dangKy = await this.findOne(
      detaiId,
      msv,
    );

    await this.dangKyRepository.remove(dangKy);

    return {
      deleted: true,
    };
  }
}