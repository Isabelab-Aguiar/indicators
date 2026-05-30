import { Module } from '@nestjs/common'
import { C4Controller } from './c4.controller'
import { C4Service } from './c4.service'
import { C4BreakdownService } from './c4-breakdown.service'
import { C4ImportService } from './c4-import.service'
import { C4PatientsService } from './c4-patients.service'

@Module({
  controllers: [C4Controller],
  providers: [C4Service, C4BreakdownService, C4ImportService, C4PatientsService],
})
export class C4Module {}
