import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { Detai } from './entities/detai.entity.js';
import { CreateDetaiDto, UpdateDetaiDto } from './dto/detai.dto.js';

@Injectable()
export class DetaiService {
  constructor(
    @InjectRepository(Detai)
    private readonly detaiRepo: Repository<Detai>,
  ) {}

  async create(dto: CreateDetaiDto): Promise<Detai> {
    const existingDetai = await this.detaiRepo.findOne({
      where: {
        tenDetai: dto.tenDetai,
      },
    });
    if (existingDetai) {
      throw new ConflictException(`Đề tài "${dto.tenDetai}" đã tồn tại`);
    }
    const detai = this.detaiRepo.create({
      ...dto,
      trangThai: 0,
    });

    return await this.detaiRepo.save(detai);
  }

  async findAll(): Promise<Detai[]> {
    return await this.detaiRepo.find();
  }

  async search(keyword: string): Promise<Detai[]> {
    return await this.detaiRepo.find({
      where: [
        { tenDetai: Like(`%${keyword}%`) },
        { moTa: Like(`%${keyword}%`) },
      ],
    });
  }

  async findOne(MDT: number): Promise<Detai> {
    const detai = await this.detaiRepo.findOneBy({ MDT });

    if (!detai) {
      throw new NotFoundException(`Không tìm thấy đề tài với id = ${MDT}`);
    }

    return detai;
  }

  async update(id: number, dto: UpdateDetaiDto): Promise<Detai> {
    const detai = await this.findOne(id);

    if (
      dto.trangThai !== undefined &&
      dto.trangThai !== 0 &&
      dto.trangThai !== 1
    ) {
      throw new BadRequestException('Trạng thái chỉ được phép là 0 hoặc 1');
    }

    Object.assign(detai, dto);

    return await this.detaiRepo.save(detai);
  }

  async updateStatus(id: number, trangThai: number): Promise<Detai> {
    const detai = await this.findOne(id);

    if (trangThai !== 0 && trangThai !== 1) {
      throw new BadRequestException('Trạng thái chỉ được phép là 0 hoặc 1');
    }

    detai.trangThai = trangThai;

    return await this.detaiRepo.save(detai);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.detaiRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy đề tài với id = ${id}`);
    }

    return { deleted: true };
  }
}
