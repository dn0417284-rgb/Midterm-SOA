
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
import { QueryFailedError, Repository } from 'typeorm';

import { DangKy } from './entities/dangky.entity.js';

@Injectable()
export class DangkyService {
  // =====================================
  // ĐỊA CHỈ CÁC SERVICE
  // =====================================

  private readonly sinhVienUrl =
    process.env.SINHVIEN_SERVICE_URL ??
    'http://localhost:3000';

  private readonly deTaiUrl =
    process.env.DETAI_SERVICE_URL ??
    'http://localhost:3002';

  constructor(
    @InjectRepository(DangKy)
    private readonly dangKyRepository: Repository<DangKy>,
    private readonly httpService: HttpService,
  ) {}

  // =====================================
  // GỌI API SANG SERVICE KHÁC
  // =====================================

  private async callService<T>(
    req: Promise<{ data: T }>,
    name: string,
  ): Promise<T> {
    try {
      const response = await req;
      return response.data;
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      console.error(
        `Lỗi khi gọi ${name}:`,
        status,
        message ?? error?.message,
      );

      if (status === 404) {
        throw new NotFoundException(
          `${name}: ${message ?? 'Không tìm thấy dữ liệu'}`,
        );
      }

      if (status === 401 || status === 403) {
        throw new ForbiddenException(
          `${name}: không có quyền truy cập`,
        );
      }

      if (status === 400) {
        throw new BadRequestException(
          `${name}: ${message ?? 'Yêu cầu không hợp lệ'}`,
        );
      }

      if (status === 409) {
        throw new ConflictException(
          `${name}: ${message ?? 'Dữ liệu đã tồn tại'}`,
        );
      }

      throw new ServiceUnavailableException(
        `${name} không phản hồi hoặc gặp lỗi`,
      );
    }
  }

  // =====================================
  // GỌI API GET
  // =====================================

  private get(url: string, token: string) {
    return firstValueFrom(
      this.httpService.get(url, {
        headers: {
          Authorization: token,
        },
      }),
    );
  }

  // =====================================
  // CẬP NHẬT TRẠNG THÁI ĐỀ TÀI
  // =====================================

  private setDetaiStatus(
    detaiId: number,
    trangThai: 0 | 1,
  ) {
    const internalKey =
      process.env.INTERNAL_SERVICE_KEY;

    if (!internalKey) {
      throw new ServiceUnavailableException(
        'Chưa cấu hình INTERNAL_SERVICE_KEY',
      );
    }

    return this.callService(
      firstValueFrom(
        this.httpService.put(
          `${this.deTaiUrl}/detai/${detaiId}/internal-status`,
          { trangThai },
          {
            headers: {
              'x-internal-key': internalKey,
            },
          },
        ),
      ),
      'DETAI service',
    );
  }

  // =====================================
  // LẤY TẤT CẢ ĐĂNG KÝ
  // =====================================

  async findAll(): Promise<DangKy[]> {
    return this.dangKyRepository.find();
  }

  // =====================================
  // TÌM MỘT ĐĂNG KÝ
  // =====================================

  async findOne(
    detaiId: number,
    msv: string,
  ): Promise<DangKy> {
    const dangKy =
      await this.dangKyRepository.findOne({
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

  // =====================================
  // LẤY ĐĂNG KÝ THEO SINH VIÊN
  // =====================================

  async findBySinhVien(
    msv: string,
  ): Promise<DangKy[]> {
    return this.dangKyRepository.find({
      where: {
        MSV: msv,
      },
    });
  }

  // =====================================
  // LẤY ĐĂNG KÝ THEO ĐỀ TÀI
  // =====================================

  async findByDetai(
    detaiId: number,
  ): Promise<DangKy[]> {
    return this.dangKyRepository.find({
      where: {
        DETAI_ID: detaiId,
      },
    });
  }

  // =====================================
  // SINH VIÊN ĐĂNG KÝ ĐỀ TÀI
  // =====================================

  async create(
    msv: string,
    detaiId: number,
    token: string,
  ): Promise<DangKy> {

    // 1. Kiểm tra sinh viên tồn tại
    await this.callService(
      this.get(
        `${this.sinhVienUrl}/sinhvien/${encodeURIComponent(msv)}`,
        token,
      ),
      'SINHVIEN service',
    );

    // 2. Kiểm tra sinh viên đã đăng ký chưa
    const existingStudent =
      await this.dangKyRepository.findOne({
        where: {
          MSV: msv,
        },
      });

    if (existingStudent) {
      throw new ConflictException(
        'Bạn đã đăng ký một đề tài. Vui lòng hủy đăng ký cũ trước khi đăng ký đề tài khác.',
      );
    }

    // 3. Kiểm tra đề tài tồn tại
    const deTai: any = await this.callService(
      this.get(
        `${this.deTaiUrl}/detai/${detaiId}`,
        token,
      ),
      'DETAI service',
    );

    // 4. Kiểm tra trạng thái đề tài
    if (
      deTai.trangThai === 1 ||
      deTai.trangThai === true
    ) {
      throw new ConflictException(
        'Đề tài đã có sinh viên đăng ký',
      );
    }

    // 5. Kiểm tra đề tài đã có đăng ký chưa
    const existingTopic =
      await this.dangKyRepository.findOne({
        where: {
          DETAI_ID: detaiId,
        },
      });

    if (existingTopic) {
      throw new ConflictException(
        'Đề tài này đã có sinh viên đăng ký',
      );
    }

    // 6. Tạo đăng ký
    const dangKy =
      this.dangKyRepository.create({
        MSV: msv,
        DETAI_ID: detaiId,
        NGAY_DANG_KY: new Date(),
      });

    let savedDangKy: DangKy;

    try {
      savedDangKy =
        await this.dangKyRepository.save(dangKy);
    } catch (error) {
      // Bắt lỗi trùng UNIQUE từ MySQL
      if (
        error instanceof QueryFailedError &&
        (error as any).driverError?.code ===
          'ER_DUP_ENTRY'
      ) {
        throw new ConflictException(
          'Sinh viên hoặc đề tài đã có đăng ký',
        );
      }

      throw error;
    }

    // 7. Chuyển trạng thái đề tài sang 1
    try {
      await this.setDetaiStatus(
        detaiId,
        1,
      );
    } catch (error) {
      // Hoàn tác đăng ký nếu cập nhật thất bại
      try {
        await this.dangKyRepository.remove(
          savedDangKy,
        );
      } catch (rollbackError) {
        console.error(
          'Không thể hoàn tác đăng ký:',
          rollbackError,
        );
      }

      throw error;
    }

    return savedDangKy;
  }

  // =====================================
  // HỦY / XÓA ĐĂNG KÝ
  // =====================================

  async remove(
    detaiId: number,
    msv: string,
    _token: string,
  ): Promise<{ deleted: boolean }> {

    // 1. Kiểm tra đăng ký tồn tại
    const dangKy =
      await this.findOne(detaiId, msv);

    // 2. Chuyển trạng thái đề tài về 0
    await this.setDetaiStatus(
      detaiId,
      0,
    );

    // 3. Xóa đăng ký
    await this.dangKyRepository.remove(
      dangKy,
    );

    return {
      deleted: true,
    };
  }
}
