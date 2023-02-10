import { Test, TestingModule } from '@nestjs/testing';
import { EtcService } from './etc.service';

describe('EtcService', () => {
  let service: EtcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtcService],
    }).compile();

    service = module.get<EtcService>(EtcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
