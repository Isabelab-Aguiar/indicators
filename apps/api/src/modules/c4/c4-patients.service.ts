import { Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DATABASE_TOKEN } from '../../database/database.module'
import { c4Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import type { C4DiabeticRecord } from '@repo/types'

type Database = NodePgDatabase<typeof schema>

@Injectable()
export class C4PatientsService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async findAll(tenant: TenantContextPayload, periodo?: string): Promise<C4DiabeticRecord[]> {
    const conditions = periodo
      ? and(eq(c4Scores.esfId, tenant.esfId), eq(c4Scores.periodo, periodo))
      : eq(c4Scores.esfId, tenant.esfId)

    const rows = await this.db.query.c4Scores.findMany({ where: conditions })

    return rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      microarea: row.microarea,
      acs: row.acs,
      periodo: row.periodo,
      consultationsLast6m: row.consultationsLast6m,
      bloodPressureLast6m: row.bloodPressureLast6m,
      weightHeightLast12m: row.weightHeightLast12m,
      acsVisitsLast12m: row.acsVisitsLast12m,
      acsVisitsIntervalDays: row.acsVisitsIntervalDays,
      hba1cLast12m: row.hba1cLast12m,
      feetEvaluationLast12m: row.feetEvaluationLast12m,
    }))
  }
}
