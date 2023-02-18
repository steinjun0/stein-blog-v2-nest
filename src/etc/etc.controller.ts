import { Controller, Get, Param, Query } from '@nestjs/common';
import { EtcService } from './etc.service';

@Controller('etc')
export class EtcController {
  constructor(private readonly etcService: EtcService) { }

  @Get('baekjoon/solved-problems')
  getSolvedProblemsNumber() {
    return this.etcService.getSolvedProblemsNumber()
  }

  @Get('solvedac/data')
  getSolvedacData() {
    return this.etcService.getSolvedacData()
  }

  @Get('auth/admin')
  getAuthOfAdmin(@Query('access-token') accessToken: string) {
    return this.etcService.getAuthOfAdmin(accessToken)
  }
}
