import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AuditService } from './audit.service'
import { CurrentTenant } from '../../common/tenant/current-tenant.decorator'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'

@ApiTags('Audit')
@Controller({ path: 'audit-logs', version: '1' })
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Listar registros de auditoria da ESF autenticada' })
  findAll(@CurrentTenant() tenant: TenantContextPayload) {
    return this.auditService.findByEsf(tenant.esfId)
  }
}
