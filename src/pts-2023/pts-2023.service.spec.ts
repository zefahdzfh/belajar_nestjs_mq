import { Test, TestingModule } from '@nestjs/testing';
import { Pts2023Service } from './pts-2023.service';

describe('Pts2023Service', () => {
  let service: Pts2023Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Pts2023Service],
    }).compile();

    service = module.get<Pts2023Service>(Pts2023Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
