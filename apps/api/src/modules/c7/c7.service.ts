import { Injectable } from '@nestjs/common'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C7BreakdownService } from './c7-breakdown.service'
import { C7ImportService } from './c7-import.service'
import { C7PatientsService } from './c7-patients.service'

@Injectable()
export class C7Service {
  constructor(
    private readonly breakdownService: C7BreakdownService,
    private readonly importService: C7ImportService,
    private readonly patientsService: C7PatientsService,
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
