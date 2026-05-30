import { Module } from '@nestjs/common'
import { C2Controller } from './c2.controller'
import { C2Service } from './c2.service'
import { C2BreakdownService } from './c2-breakdown.service'
import { C2ImportService } from './c2-import.service'

@Module({
  controllers: [C2Controller],
  providers: [C2Service, C2BreakdownService, C2ImportService],
})
export class C2Module {}
