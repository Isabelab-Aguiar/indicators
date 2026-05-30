import { Injectable } from '@nestjs/common'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C4BreakdownService } from './c4-breakdown.service'
import { C4ImportService } from './c4-import.service'
import { C4PatientsService } from './c4-patients.service'

@Injectable()
export class C4Service {
  constructor(
    private readonly breakdownService: C4BreakdownService,
    private readonly importService: C4ImportService,
    private readonly patientsService: C4PatientsService,
  ) {}

  getBreakdown(tenant: TenantContextPayload, periodo?: string) {
    return this.breakdownService.getBreakdown(tenant, periodo)
  }

  getPatients(tenant: TenantContextPayload, periodo?: string) {
    return this.patientsService.findAll(tenant, periodo)
  }

  importCsv(csvContent: string, periodo: string, tenant: TenantContextPayload) {
    return this.importService.importCsv(csvContent, periodo, tenant)
  }

  getCsvTemplate(): string {
    return this.importService.getTemplate()
  }
}
