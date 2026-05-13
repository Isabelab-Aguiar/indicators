import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import { auditLogs } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { AuditLogRecord } from '../../database/schema'

type Database = NodePgDatabase<typeof schema>

export interface CreateAuditLogInput {
  userId: string | null
  esfId: string | null
  action: AuditLogRecord['action']
  entity: AuditLogRecord['entity']
  entityId?: string
  metadata?: Record<string, unknown>
  ipAddress: string
  userAgent: string
}

@Injectable()
export class AuditService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async log(input: CreateAuditLogInput): Promise<void> {
    await this.db.insert(auditLogs).values({
      userId: input.userId ?? undefined,
      esfId: input.esfId ?? undefined,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      metadata: input.metadata,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    })
  }

  async findByEsf(esfId: string) {
    return this.db.query.auditLogs.findMany({
      where: eq(auditLogs.esfId, esfId),
      orderBy: (t, { desc }) => [desc(t.createdAt)],
      limit: 200,
    })
  }
}
