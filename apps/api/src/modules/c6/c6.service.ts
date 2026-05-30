import { Injectable } from '@nestjs/common'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C6BreakdownService } from './c6-breakdown.service'
import { C6ImportService } from './c6-import.service'
import { C6PatientsService } from './c6-patients.service'

@Injectable()
export class C6Service {
  constructor(
    private readonly breakdownService: C6BreakdownService,
    private readonly importService: C6ImportService,
    private readonly patientsService: C6PatientsService,
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
