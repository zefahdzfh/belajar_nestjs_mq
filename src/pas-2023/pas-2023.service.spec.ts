import { Test, TestingModule } from '@nestjs/testing';
import { Pas2023Service } from './pas-2023.service';

describe('Pas2023Service', () => {
  let service: Pas2023Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Pas2023Service],
    }).compile();

    service = module.get<Pas2023Service>(Pas2023Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
