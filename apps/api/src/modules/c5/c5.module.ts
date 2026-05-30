import { Module } from '@nestjs/common'

import { C5Controller } from './c5.controller'
import { C5Service } from './c5.service'
import { C5BreakdownService } from './c5-breakdown.service'
import { C5ImportService } from './c5-import.service'
import { C5PatientsService } from './c5-patients.service'

@Module({
  controllers: [C5Controller],
  providers: [C5Service, C5BreakdownService, C5ImportService, C5PatientsService],
})
export class C5Module {}
