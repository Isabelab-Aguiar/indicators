import { Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import { c6Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import type { C6ElderlyRecord } from '@repo/types'

type Database = NodePgDatabase<typeof schema>

@Injectable()
export class C6PatientsService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async findAll(tenant: TenantContextPayload, periodo?: string): Promise<C6ElderlyRecord[]> {
    const conditions = periodo
      ? and(eq(c6Scores.esfId, tenant.esfId), eq(c6Scores.periodo, periodo))
      : eq(c6Scores.esfId, tenant.esfId)

    const rows = await this.db.query.c6Scores.findMany({ where: conditions })

    return rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      birthDate: row.birthDate,
      microarea: row.microarea,
      acs: row.acs,
      periodo: row.periodo,
      consultationsLast12m: row.consultationsLast12m,
      weightHeightLast12m: row.weightHeightLast12m,
      acsVisitsLast12m: row.acsVisitsLast12m,
      acsVisitsIntervalDays: row.acsVisitsIntervalDays,
      influenzaVaccineLast12m: row.influenzaVaccineLast12m,
    }))
  }
}
