import { Test, TestingModule } from '@nestjs/testing';
import { DetaiService } from './detai.service.js';

describe('DetaiService', () => {
  let service: DetaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetaiService],
    }).compile();

    service = module.get<DetaiService>(DetaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
