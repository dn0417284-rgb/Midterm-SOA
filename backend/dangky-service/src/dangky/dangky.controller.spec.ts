import { Test, TestingModule } from '@nestjs/testing';
import { DangkyController } from './dangky.controller.js';

describe('DangkyController', () => {
  let controller: DangkyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DangkyController],
    }).compile();

    controller = module.get<DangkyController>(DangkyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
