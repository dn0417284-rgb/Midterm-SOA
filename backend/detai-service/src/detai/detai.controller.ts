import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { CreateDetaiDto, UpdateDetaiDto } from './dto/detai.dto.js';
import { DetaiService } from './detai.service.js';

@Controller('detai')
export class DetaiController {
  constructor(private readonly detaiService: DetaiService) {}

  // Thêm đề tài
  @Post()
  create(@Body() dto: CreateDetaiDto) {
    return this.detaiService.create(dto);
  }

  // Lấy danh sách đề tài
  @Get()
  findAll() {
    return this.detaiService.findAll();
  }

  // Tìm kiếm đề tài
  @Get('search')
  search(@Query('keyword') keyword: string) {
    return this.detaiService.search(keyword);
  }

  // Lấy chi tiết đề tài
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.detaiService.findOne(id);
  }

  // Cập nhật thông tin đề tài
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateDetaiDto) {
    return this.detaiService.update(id, dto);
  }

  // Thay đổi trạng thái đề tài
  @Put(':id/status')
  updateStatus(@Param('id') id: number, @Body('trangThai') trangThai: number) {
    return this.detaiService.updateStatus(id, trangThai);
  }

  // Xóa đề tài
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.detaiService.remove(id);
  }
}
