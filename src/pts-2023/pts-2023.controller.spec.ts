import { Test, TestingModule } from '@nestjs/testing';
import { Pts2023Controller } from './pts-2023.controller';

describe('Pts2023Controller', () => {
  let controller: Pts2023Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Pts2023Controller],
    }).compile();

    controller = module.get<Pts2023Controller>(Pts2023Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
