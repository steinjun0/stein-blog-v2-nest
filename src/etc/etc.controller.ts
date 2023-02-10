import { Controller, Get } from '@nestjs/common';
import { EtcService } from './etc.service';

@Controller('etc')
export class EtcController {
  constructor(private readonly etcService: EtcService) { }

  @Get('baekjoon/solved-problems')
  getSolvedProblemsNumber() {
    return this.etcService.getSolvedProblemsNumber()
  }

}
