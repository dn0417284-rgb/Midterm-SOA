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
  private readonly sinhVienUrl = process.env.SINHVIEN_SERVICE_URL;

  private readonly deTaiUrl = process.env.DETAI_SERVICE_URL;

  constructor(
    @InjectRepository(DangKy)
    private readonly dangKyRepository: Repository<DangKy>,
    private readonly httpService: HttpService,
  ) {}

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

      console.error(`Lỗi khi gọi ${name}:`, status, message ?? error?.message);

      if (status === 404) {
        throw new NotFoundException(
          `${name}: ${message ?? 'Không tìm thấy dữ liệu'}`,
        );
      }

      if (status === 401 || status === 403) {
        throw new ForbiddenException(`${name}: không có quyền truy cập`);
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

  private get(url: string, token: string) {
    return firstValueFrom(
      this.httpService.get(url, {
        headers: {
          Authorization: token,
        },
      }),
    );
  }

  private setDetaiStatus(detaiId: number, trangThai: 0 | 1) {
    const internalKey = process.env.INTERNAL_SERVICE_KEY;

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

  async findAll(): Promise<DangKy[]> {
    return this.dangKyRepository.find();
  }

  async findOne(detaiId: number, msv: string): Promise<DangKy> {
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

  async findBySinhVien(msv: string): Promise<DangKy[]> {
    return this.dangKyRepository.find({
      where: {
        MSV: msv,
      },
    });
  }

  async findByDetai(detaiId: number): Promise<DangKy[]> {
    return this.dangKyRepository.find({
      where: {
        DETAI_ID: detaiId,
      },
    });
  }

  async create(msv: string, detaiId: number, token: string): Promise<DangKy> {
    await this.callService(
      this.get(
        `${this.sinhVienUrl}/sinhvien/${encodeURIComponent(msv)}`,
        token,
      ),
      'SINHVIEN service',
    );

    const existingStudent = await this.dangKyRepository.findOne({
      where: {
        MSV: msv,
      },
    });

    if (existingStudent) {
      throw new ConflictException(
        'Bạn đã đăng ký một đề tài. Vui lòng hủy đăng ký cũ trước khi đăng ký đề tài khác.',
      );
    }

    const deTai: any = await this.callService(
      this.get(`${this.deTaiUrl}/detai/${detaiId}`, token),
      'DETAI service',
    );

    if (deTai.trangThai === 1 || deTai.trangThai === true) {
      throw new ConflictException('Đề tài đã có sinh viên đăng ký');
    }

    const existingTopic = await this.dangKyRepository.findOne({
      where: {
        DETAI_ID: detaiId,
      },
    });

    if (existingTopic) {
      throw new ConflictException('Đề tài này đã có sinh viên đăng ký');
    }

    const dangKy = this.dangKyRepository.create({
      MSV: msv,
      DETAI_ID: detaiId,
      NGAY_DANG_KY: new Date(),
    });

    let savedDangKy: DangKy;

    try {
      savedDangKy = await this.dangKyRepository.save(dangKy);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).driverError?.code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('Sinh viên hoặc đề tài đã có đăng ký');
      }

      throw error;
    }

    try {
      await this.setDetaiStatus(detaiId, 1);
    } catch (error) {
      try {
        await this.dangKyRepository.remove(savedDangKy);
      } catch (rollbackError) {
        console.error('Không thể hoàn tác đăng ký:', rollbackError);
      }

      throw error;
    }

    return savedDangKy;
  }

  async remove(
    detaiId: number,
    msv: string,
    _token: string,
  ): Promise<{ deleted: boolean }> {
    const dangKy = await this.findOne(detaiId, msv);

    await this.setDetaiStatus(detaiId, 0);

    await this.dangKyRepository.remove(dangKy);

    return {
      deleted: true,
    };
  }
}
