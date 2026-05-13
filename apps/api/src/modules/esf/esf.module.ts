import { Module } from '@nestjs/common'

import { EsfController } from './esf.controller'
import { EsfService } from './esf.service'
import { EsfRepository } from './esf.repository'

@Module({
  controllers: [EsfController],
  providers: [EsfService, EsfRepository],
  exports: [EsfService],
})
export class EsfModule {}
