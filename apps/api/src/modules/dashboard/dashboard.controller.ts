import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { DashboardService } from './dashboard.service'
import { CurrentTenant } from '../../common/tenant/current-tenant.decorator'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'

@ApiTags('Dashboard')
@Controller({ path: 'dashboard', version: '1' })
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'KPIs e métricas da ESF autenticada' })
  getMetrics(@CurrentTenant() tenant: TenantContextPayload) {
    return this.dashboardService.getMetrics(tenant)
  }

  @Get('microarea-stats')
  @ApiOperation({ summary: 'Estatísticas por microárea da ESF autenticada' })
  getMicroareaStats(@CurrentTenant() tenant: TenantContextPayload) {
    return this.dashboardService.getMicroareaStats(tenant)
  }
}
