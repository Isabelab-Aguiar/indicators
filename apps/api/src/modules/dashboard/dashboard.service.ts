import { Inject, Injectable } from '@nestjs/common'
import { and, count, eq, gte, SQL } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import { pregnantWomen } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { PRENATAL_TARGETS } from '@repo/config'

type Database = NodePgDatabase<typeof schema>

@Injectable()
export class DashboardService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async getMetrics(tenant: TenantContextPayload) {
    const esfFilter: SQL = eq(pregnantWomen.esfId, tenant.esfId)

    const [totalResult] = await this.db
      .select({ total: count() })
      .from(pregnantWomen)
      .where(esfFilter)

    const [withHighBp] = await this.db
      .select({ total: count() })
      .from(pregnantWomen)
      .where(and(esfFilter, eq(pregnantWomen.bloodPressureStatus, 'high')))

    const [withCriticalBp] = await this.db
      .select({ total: count() })
      .from(pregnantWomen)
      .where(and(esfFilter, eq(pregnantWomen.bloodPressureStatus, 'critical')))

    const [upToDate] = await this.db
      .select({ total: count() })
      .from(pregnantWomen)
      .where(
        and(
          esfFilter,
          gte(pregnantWomen.prenatalConsultations, PRENATAL_TARGETS.MIN_CONSULTATIONS),
        ),
      )

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const [visitedThisMonth] = await this.db
      .select({ total: count() })
      .from(pregnantWomen)
      .where(and(esfFilter, gte(pregnantWomen.lastMeasurementDate, startOfMonth)))

    return {
      total: Number(totalResult?.total ?? 0),
      withPrenatalUpToDate: Number(upToDate?.total ?? 0),
      withHighBloodPressure: Number(withHighBp?.total ?? 0) + Number(withCriticalBp?.total ?? 0),
      visitedThisMonth: Number(visitedThisMonth?.total ?? 0),
    }
  }

  async getMicroareaStats(tenant: TenantContextPayload) {
    return this.db
      .select({
        microarea: pregnantWomen.microarea,
        total: count(),
      })
      .from(pregnantWomen)
      .where(eq(pregnantWomen.esfId, tenant.esfId))
      .groupBy(pregnantWomen.microarea)
      .orderBy(pregnantWomen.microarea)
  }
}
