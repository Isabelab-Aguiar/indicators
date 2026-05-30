import { Injectable } from '@nestjs/common'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C2BreakdownService } from './c2-breakdown.service'
import { C2ImportService } from './c2-import.service'

@Injectable()
export class C2Service {
  constructor(
    private readonly breakdownService: C2BreakdownService,
    private readonly importService: C2ImportService,
  ) {}

  getBreakdown(tenant: TenantContextPayload, periodo?: string) {
    return this.breakdownService.getBreakdown(tenant, periodo)
  }

  importCsv(csvContent: string, periodo: string, tenant: TenantContextPayload) {
    return this.importService.importCsv(csvContent, periodo, tenant)
  }

  getCsvTemplate(): string {
    return this.importService.getTemplate()
  }
}
