import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { DangKy } from './entities/dangky.entity.js';
import { UpdateDangKyDto } from './dto/update-dangky.dto.js';

@Injectable()
export class DangkyService {
  private readonly sinhVienUrl =
    process.env.SINHVIEN_SERVICE_URL ?? 'http://localhost:3003';

  private readonly deTaiUrl =
    process.env.DETAI_SERVICE_URL ?? 'http://localhost:3002';

  constructor(
    @InjectRepository(DangKy)
    private readonly dangKyRepository: Repository<DangKy>,
    private readonly httpService: HttpService,
  ) {}

  // =========================
  // HÀM GỌI SERVICE KHÁC
  // =========================

  private async callService<T>(
    req: Promise<{ data: T }>,
    name: string,
  ): Promise<T> {
    try {
      return (await req).data;
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 404) {
        throw new NotFoundException(`${name}: không tìm thấy dữ liệu`);
      }
      if (status === 401 || status === 403) {
        throw new ForbiddenException(`${name}: không có quyền`);
      }
      throw new ServiceUnavailableException(`${name} không phản hồi`);
    }
  }

  private get(url: string, token: string) {
    return firstValueFrom(
      this.httpService.get(url, { headers: { Authorization: token } }),
    );
  }

  private put(url: string, body: unknown, token: string) {
    return firstValueFrom(
      this.httpService.put(url, body, { headers: { Authorization: token } }),
    );
  }

  private setDetaiStatus(detaiId: number, trangThai: 0 | 1, token: string) {
    return this.callService(
      this.put(`${this.deTaiUrl}/detai/${detaiId}/status`, { trangThai }, token),
      'DETAI service',
    );
  }

  // =========================
  // TRUY VẤN
  // =========================

  async findAll(): Promise<DangKy[]> {
    return this.dangKyRepository.find();
  }

  async findOne(detaiId: number, msv: string): Promise<DangKy> {
    const dangKy = await this.dangKyRepository.findOne({
      where: { DETAI_ID: detaiId, MSV: msv },
    });

    if (!dangKy) {
      throw new NotFoundException(
        `Không tìm thấy đăng ký của sinh viên ${msv} với đề tài ${detaiId}`,
      );
    }
    return dangKy;
  }

  async findBySinhVien(msv: string): Promise<DangKy[]> {
    return this.dangKyRepository.find({ where: { MSV: msv } });
  }

  async findByDetai(detaiId: number): Promise<DangKy[]> {
    return this.dangKyRepository.find({ where: { DETAI_ID: detaiId } });
  }

  // =========================
  // ĐĂNG KÝ ĐỀ TÀI
  // =========================

  async create(msv: string, detaiId: number, token: string): Promise<DangKy> {
    // 1. Gọi SINHVIEN service
    await this.callService(
      this.get(`${this.sinhVienUrl}/sinhvien/${encodeURIComponent(msv)}`, token),
      'SINHVIEN service',
    );

    // 2. Gọi DETAI service
    const deTai: any = await this.callService(
      this.get(`${this.deTaiUrl}/detai/${detaiId}`, token),
      'DETAI service',
    );

    // 3. trangThai: 0 = chưa đăng ký, 1 = đã đăng ký
    if (deTai.trangThai === 1) {
      throw new BadRequestException('Đề tài đã có người được duyệt');
    }

    // 4. Kiểm tra đăng ký trùng
    const existing = await this.dangKyRepository.findOne({
      where: { MSV: msv, DETAI_ID: detaiId },
    });
    if (existing) {
      throw new ConflictException('Sinh viên đã đăng ký đề tài này');
    }

    // 5. Tạo đăng ký
    return this.dangKyRepository.save(
      this.dangKyRepository.create({
        MSV: msv,
        DETAI_ID: detaiId,
        NGAY_DANG_KY: new Date(),
        TRANG_THAI: 'CHO_DUYET',
      }),
    );
  }

  // =========================
  // DUYỆT / TỪ CHỐI
  // =========================

  async update(
    detaiId: number,
    msv: string,
    dto: UpdateDangKyDto,
    token: string,
  ): Promise<DangKy> {
    const dangKy = await this.findOne(detaiId, msv);

    if (dto.trangThai === 'DA_DUYET' && dangKy.TRANG_THAI !== 'DA_DUYET') {
      const deTai: any = await this.callService(
        this.get(`${this.deTaiUrl}/detai/${detaiId}`, token),
        'DETAI service',
      );
      if (deTai.trangThai === 1) {
        throw new BadRequestException(
          'Đề tài đã được duyệt cho sinh viên khác',
        );
      }
      // Đồng bộ: đánh dấu đề tài đã có người đăng ký
      await this.setDetaiStatus(detaiId, 1, token);
    }

    // Đang DA_DUYET mà đổi sang trạng thái khác -> mở lại đề tài
    if (
      dangKy.TRANG_THAI === 'DA_DUYET' &&
      dto.trangThai !== undefined &&
      dto.trangThai !== 'DA_DUYET'
    ) {
      await this.setDetaiStatus(detaiId, 0, token);
    }

    if (dto.trangThai !== undefined) {
      dangKy.TRANG_THAI = dto.trangThai;
    }
    return this.dangKyRepository.save(dangKy);
  }

  // =========================
  // XÓA ĐĂNG KÝ
  // =========================

  async remove(
    detaiId: number,
    msv: string,
    token: string,
  ): Promise<{ deleted: boolean }> {
    const dangKy = await this.findOne(detaiId, msv);

    // Xóa đăng ký đã duyệt -> mở lại đề tài
    if (dangKy.TRANG_THAI === 'DA_DUYET') {
      await this.setDetaiStatus(detaiId, 0, token);
    }

    await this.dangKyRepository.remove(dangKy);
    return { deleted: true };
  }
}