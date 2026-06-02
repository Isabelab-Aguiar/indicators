import { Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'

import { AdminGuard } from './admin.guard'
import { AdminService } from './admin.service'
import type { AdminStats } from './types/admin-stats.type'
import type { AccessRequestRecord } from '../database/schema'
import type { AuthenticatedRequest } from '../common/types/authenticated-request'
import type { TenantContextPayload } from '../common/tenant/tenant-context'

interface TenantRequest extends AuthenticatedRequest {
  tenant: TenantContextPayload
}

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats(): Promise<AdminStats> {
    return this.adminService.getStats()
  }

  @Get('esfs')
  getEsfs() {
    return this.adminService.getEsfs()
  }

  @Get('users')
  getUsers(
    @Query('esfId') esfId?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getUsers({ esfId, role, status })
  }

  @Get('access-requests')
  getAccessRequests(@Query('status') status?: string) {
    return this.adminService.getAccessRequests(status)
  }

  @Post('access-requests/:id/approve')
  approveRequest(@Param('id') id: string, @Req() req: TenantRequest): Promise<AccessRequestRecord> {
    return this.adminService.approveRequest(id, req.tenant)
  }

  @Post('access-requests/:id/reject')
  rejectRequest(@Param('id') id: string, @Req() req: TenantRequest): Promise<AccessRequestRecord> {
    return this.adminService.rejectRequest(id, req.tenant)
  }
}
