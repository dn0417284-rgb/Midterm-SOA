import { Test, TestingModule } from '@nestjs/testing';
import { SinhvienController } from './sinhvien.controller.js';

describe('SinhvienController', () => {
  let controller: SinhvienController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SinhvienController],
    }).compile();

    controller = module.get<SinhvienController>(SinhvienController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
