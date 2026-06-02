import { Inject, Injectable } from '@nestjs/common'
import { and, count, desc, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../database/database.module'
import { accessRequests, auditLogs, esfs, profiles } from '../database/schema'
import type * as schema from '../database/schema'
import type { UserRole } from '@repo/types'
import type { AdminStats } from './types/admin-stats.type'

type Database = NodePgDatabase<typeof schema>

@Injectable()
export class AdminRepository {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async getStats(): Promise<AdminStats> {
    const [totalEsfsResult, totalUsersResult, activeUsersResult, pendingRequestsResult] =
      await Promise.all([
        this.db.select({ count: count() }).from(esfs),
        this.db.select({ count: count() }).from(profiles),
        this.db.select({ count: count() }).from(profiles).where(eq(profiles.status, 'active')),
        this.db
          .select({ count: count() })
          .from(accessRequests)
          .where(eq(accessRequests.status, 'pending')),
      ])

    const roleRows = await this.db
      .select({ role: profiles.role, count: count() })
      .from(profiles)
      .groupBy(profiles.role)

    const esfRows = await this.db
      .select({ esfId: esfs.id, esfName: esfs.name, esfCode: esfs.code, count: count(profiles.id) })
      .from(esfs)
      .leftJoin(profiles, eq(profiles.esfId, esfs.id))
      .groupBy(esfs.id, esfs.name, esfs.code)
      .orderBy(desc(count(profiles.id)))
      .limit(10)

    const activityRows = await this.db
      .select({
        userId: auditLogs.userId,
        action: auditLogs.action,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(20)

    const usersByRole = roleRows.reduce<Record<UserRole, number>>(
      (acc, row) => {
        acc[row.role as UserRole] = Number(row.count)
        return acc
      },
      { admin: 0, manager: 0, nurse: 0, doctor: 0, acs: 0 },
    )

    return {
      totalEsfs: Number(totalEsfsResult[0]?.count ?? 0),
      totalUsers: Number(totalUsersResult[0]?.count ?? 0),
      activeUsers: Number(activeUsersResult[0]?.count ?? 0),
      pendingRequests: Number(pendingRequestsResult[0]?.count ?? 0),
      usersByRole,
      usersByEsf: esfRows.map((r) => ({
        esfId: r.esfId,
        esfName: r.esfName,
        esfCode: r.esfCode,
        count: Number(r.count),
      })),
      recentActivity: activityRows.map((r) => ({
        userId: r.userId ?? '',
        action: r.action,
        createdAt: r.createdAt,
      })),
    }
  }

  getEsfs() {
    return this.db
      .select({ id: esfs.id, name: esfs.name, code: esfs.code, userCount: count(profiles.id) })
      .from(esfs)
      .leftJoin(profiles, eq(profiles.esfId, esfs.id))
      .groupBy(esfs.id, esfs.name, esfs.code)
      .orderBy(esfs.name)
  }

  getUsers(filters: { esfId?: string; role?: string; status?: string }) {
    const conditions = []
    if (filters.esfId) conditions.push(eq(profiles.esfId, filters.esfId))
    if (filters.role)
      conditions.push(
        eq(profiles.role, filters.role as 'admin' | 'manager' | 'nurse' | 'doctor' | 'acs'),
      )
    if (filters.status)
      conditions.push(
        eq(profiles.status, filters.status as 'active' | 'inactive' | 'pending_first_access'),
      )

    return this.db
      .select({
        id: profiles.id,
        name: profiles.name,
        email: profiles.email,
        role: profiles.role,
        status: profiles.status,
        esfId: profiles.esfId,
        createdAt: profiles.createdAt,
      })
      .from(profiles)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(profiles.createdAt))
  }

  getAccessRequests(status?: string) {
    const condition = status
      ? eq(accessRequests.status, status as 'pending' | 'approved' | 'rejected')
      : undefined

    return this.db.query.accessRequests.findMany({
      where: condition,
      with: {
        esf: { columns: { id: true, name: true, code: true } },
        reviewer: { columns: { id: true, name: true } },
      },
      orderBy: (t, { desc: d }) => [d(t.createdAt)],
    })
  }
}
