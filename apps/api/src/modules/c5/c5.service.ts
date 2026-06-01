import { Injectable } from '@nestjs/common'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C5BreakdownService } from './c5-breakdown.service'
import { C5ImportService } from './c5-import.service'
import { C5PatientsService } from './c5-patients.service'

@Injectable()
export class C5Service {
  constructor(
    private readonly breakdownService: C5BreakdownService,
    private readonly importService: C5ImportService,
    private readonly patientsService: C5PatientsService,
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
}
