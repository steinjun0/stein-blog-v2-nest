import { Module } from '@nestjs/common';
import { EtcService } from './etc.service';
import { EtcController } from './etc.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [EtcController],
  providers: [EtcService]
})
export class EtcModule { }
