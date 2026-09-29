import { Test, TestingModule } from '@nestjs/testing';
import { DetaiController } from './detai.controller.js';

describe('DetaiController', () => {
  let controller: DetaiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetaiController],
    }).compile();

    controller = module.get<DetaiController>(DetaiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
