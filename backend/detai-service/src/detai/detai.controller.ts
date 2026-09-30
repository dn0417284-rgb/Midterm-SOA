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

  @Post()
  create(@Body() dto: CreateDetaiDto) {
    return this.detaiService.create(dto);
  }

  @Get()
  findAll() {
    return this.detaiService.findAll();
  }

  @Get('search')
  search(@Query('keyword') keyword: string) {
    return this.detaiService.search(keyword);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.detaiService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateDetaiDto) {
    return this.detaiService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.detaiService.remove(id);
  }
}
