import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common'
import { eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../database/database.module'
import { accessRequests } from '../database/schema'
import type * as schema from '../database/schema'
import type { AccessRequestRecord } from '../database/schema'
import type { TenantContextPayload } from '../common/tenant/tenant-context'
import { UsersService } from '../modules/users/users.service'
import { AuditService } from '../modules/audit/audit.service'
import { AdminRepository } from './admin.repository'
import type { AdminStats } from './types/admin-stats.type'

type Database = NodePgDatabase<typeof schema>

@Injectable()
export class AdminService {
  constructor(
    @Inject(DATABASE_TOKEN) private readonly db: Database,
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
    private readonly auditService: AuditService,
    private readonly adminRepository: AdminRepository,
  ) {}

  getStats(): Promise<AdminStats> {
    return this.adminRepository.getStats()
  }

  getEsfs() {
    return this.adminRepository.getEsfs()
  }

  getUsers(filters: { esfId?: string; role?: string; status?: string }) {
    return this.adminRepository.getUsers(filters)
  }

  getAccessRequests(status?: string) {
    return this.adminRepository.getAccessRequests(status)
  }

  async approveRequest(id: string, tenant: TenantContextPayload): Promise<AccessRequestRecord> {
    const request = await this.db.query.accessRequests.findFirst({
      where: eq(accessRequests.id, id),
    })

    if (!request) throw new NotFoundException('Solicitação não encontrada')
    if (request.status !== 'pending') throw new BadRequestException('Solicitação já foi processada')

    await this.usersService.invite(
      {
        name: request.name,
        email: request.email,
        cpf: request.cpf,
        role: request.role,
        esfId: request.esfId,
      },
      tenant,
    )

    const [updated] = await this.db
      .update(accessRequests)
      .set({ status: 'approved', reviewedBy: tenant.userId, reviewedAt: new Date() })
      .where(eq(accessRequests.id, id))
      .returning()

    await this.auditService.log({
      userId: tenant.userId,
      esfId: tenant.esfId,
      action: 'ACCESS_REQUEST_APPROVED',
      entity: 'access_request',
      entityId: id,
      ipAddress: '',
      userAgent: '',
    })

    return updated
  }

  async rejectRequest(id: string, tenant: TenantContextPayload): Promise<AccessRequestRecord> {
    const request = await this.db.query.accessRequests.findFirst({
      where: eq(accessRequests.id, id),
    })

    if (!request) throw new NotFoundException('Solicitação não encontrada')
    if (request.status !== 'pending') throw new BadRequestException('Solicitação já foi processada')

    const [updated] = await this.db
      .update(accessRequests)
      .set({ status: 'rejected', reviewedBy: tenant.userId, reviewedAt: new Date() })
      .where(eq(accessRequests.id, id))
      .returning()

    await this.auditService.log({
      userId: tenant.userId,
      esfId: tenant.esfId,
      action: 'ACCESS_REQUEST_REJECTED',
      entity: 'access_request',
      entityId: id,
      ipAddress: '',
      userAgent: '',
    })

    return updated
  }
}
