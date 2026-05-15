import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { randomBytes } from 'crypto'
import { addHours } from 'date-fns'

import { DATABASE_TOKEN } from '../../database/database.module'
import { inviteTokens, profiles } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { InviteUserDto } from './dto/invite-user.dto'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { TOKEN_EXPIRY } from '@repo/config'

type Database = NodePgDatabase<typeof schema>

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async findAllByEsf(tenant: TenantContextPayload) {
    return this.db.query.profiles.findMany({
      where: eq(profiles.esfId, tenant.esfId),
      columns: { passwordHash: false },
    })
  }

  async findById(id: string, tenant: TenantContextPayload) {
    const user = await this.db.query.profiles.findFirst({
      where: eq(profiles.id, id),
      columns: { passwordHash: false },
      with: { esf: true },
    })

    if (!user) throw new NotFoundException('Usuário não encontrado')
    if (!tenant.isAdmin && user.esfId !== tenant.esfId) {
      throw new ForbiddenException('Acesso negado')
    }

    return user
  }

  async invite(dto: InviteUserDto, tenant: TenantContextPayload) {
    const targetEsfId = tenant.isAdmin && dto.esfId ? dto.esfId : tenant.esfId

    const token = randomBytes(32).toString('hex')
    const expiresAt = addHours(new Date(), TOKEN_EXPIRY.INVITE_TOKEN_HOURS)

    const [invite] = await this.db
      .insert(inviteTokens)
      .values({
        email: dto.email.toLowerCase(),
        name: dto.name,
        role: dto.role as 'admin' | 'manager' | 'nurse' | 'doctor' | 'acs',
        esfId: targetEsfId,
        token,
        expiresAt,
        createdBy: tenant.userId,
      })
      .returning()

    await this.db.insert(profiles).values({
      name: dto.name,
      email: dto.email.toLowerCase(),
      passwordHash: '',
      role: dto.role as 'admin' | 'manager' | 'nurse' | 'doctor' | 'acs',
      status: 'pending_first_access',
      esfId: targetEsfId,
    })

    return { inviteId: invite.id, email: invite.email }
  }

  async deactivate(id: string, tenant: TenantContextPayload) {
    const user = await this.findById(id, tenant)

    if (!tenant.isAdmin && user.esfId !== tenant.esfId) {
      throw new ForbiddenException('Acesso negado')
    }

    await this.db
      .update(profiles)
      .set({ status: 'inactive', updatedAt: new Date() })
      .where(and(eq(profiles.id, id), eq(profiles.esfId, tenant.esfId)))
  }
}
