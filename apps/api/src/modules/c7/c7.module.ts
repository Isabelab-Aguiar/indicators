import { Module } from '@nestjs/common'

import { C7Controller } from './c7.controller'
import { C7Service } from './c7.service'
import { C7BreakdownService } from './c7-breakdown.service'
import { C7ImportService } from './c7-import.service'
import { C7PatientsService } from './c7-patients.service'
import { C7EligibilityService } from './c7-eligibility.service'

@Module({
  controllers: [C7Controller],
  providers: [
    C7Service,
    C7BreakdownService,
    C7ImportService,
    C7PatientsService,
    C7EligibilityService,
  ],
})
export class C7Module {}
