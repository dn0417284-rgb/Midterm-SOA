import { Injectable, NotFoundException } from '@nestjs/common';
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
  //Thêm đề tài
  async create(dto: CreateDetaiDto): Promise<Detai> {
    const detai = this.detaiRepo.create(dto);
    return await this.detaiRepo.save(detai);
  }
  //Lấy danh sách đề tài
  async findAll(): Promise<Detai[]> {
    return await this.detaiRepo.find();
  }
  //Tìm kiếm đề tài theo từ khóa
  async search(keyword: string): Promise<Detai[]> {
    return await this.detaiRepo.find({
      where: [
        { tenDetai: Like(`%${keyword}%`) },
        { moTa: Like(`%${keyword}%`) },
      ],
    });
  }
  //Lấy chi tiết đề tài theo ID
  async findOne(id: number): Promise<Detai> {
    const detai = await this.detaiRepo.findOneBy({ id });
    if (!detai) {
      throw new NotFoundException(`Không tìm thấy đề tài với id = ${id}`);
    }
    return detai;
  }
  //Cập nhật đề tài
  async update(id: number, dto: UpdateDetaiDto): Promise<Detai> {
    const detai = await this.findOne(id);
    Object.assign(detai, dto);
    return await this.detaiRepo.save(detai);
  }

  //Xóa đề tài
  async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.detaiRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy đề tài với id = ${id}`);
    }
    return { deleted: true };
  }
}
