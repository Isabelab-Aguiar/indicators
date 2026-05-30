import { Module } from '@nestjs/common'

import { C6Controller } from './c6.controller'
import { C6Service } from './c6.service'
import { C6BreakdownService } from './c6-breakdown.service'
import { C6ImportService } from './c6-import.service'
import { C6PatientsService } from './c6-patients.service'

@Module({
  controllers: [C6Controller],
  providers: [C6Service, C6BreakdownService, C6ImportService, C6PatientsService],
})
export class C6Module {}
