import { Test, TestingModule } from '@nestjs/testing';
import { EtcController } from './etc.controller';
import { EtcService } from './etc.service';

describe('EtcController', () => {
  let controller: EtcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtcController],
      providers: [EtcService],
    }).compile();

    controller = module.get<EtcController>(EtcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
