import { Test, TestingModule } from '@nestjs/testing';
import { DangkyService } from './dangky.service.js';

describe('DangkyService', () => {
  let service: DangkyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DangkyService],
    }).compile();

    service = module.get<DangkyService>(DangkyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
