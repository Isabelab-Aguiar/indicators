import { Module } from '@nestjs/common'

import { PregnantWomenController } from './pregnant-women.controller'
import { PregnantWomenService } from './pregnant-women.service'
import { PregnantWomenRepository } from './pregnant-women.repository'

@Module({
  controllers: [PregnantWomenController],
  providers: [PregnantWomenService, PregnantWomenRepository],
  exports: [PregnantWomenService],
})
export class PregnantWomenModule {}
