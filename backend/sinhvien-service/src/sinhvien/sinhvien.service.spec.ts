import { Test, TestingModule } from '@nestjs/testing';
import { SinhvienService } from './sinhvien.service.js';

describe('SinhvienService', () => {
  let service: SinhvienService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SinhvienService],
    }).compile();

    service = module.get<SinhvienService>(SinhvienService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
