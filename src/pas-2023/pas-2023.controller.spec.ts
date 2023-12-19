import { Test, TestingModule } from '@nestjs/testing';
import { Pas2023Controller } from './pas-2023.controller';

describe('Pas2023Controller', () => {
  let controller: Pas2023Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Pas2023Controller],
    }).compile();

    controller = module.get<Pas2023Controller>(Pas2023Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
