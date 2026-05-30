import { Inject, Injectable } from '@nestjs/common'
import { eq, and } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import { c7Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import type { C7WomanRecord } from '@repo/types'

type Database = NodePgDatabase<typeof schema>

@Injectable()
export class C7PatientsService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async findAll(tenant: TenantContextPayload, periodo?: string): Promise<C7WomanRecord[]> {
    const conditions = periodo
      ? and(eq(c7Scores.esfId, tenant.esfId), eq(c7Scores.periodo, periodo))
      : eq(c7Scores.esfId, tenant.esfId)

    const rows = await this.db.query.c7Scores.findMany({ where: conditions })

    return rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      birthDate: row.birthDate,
      microarea: row.microarea,
      acs: row.acs,
      periodo: row.periodo,
      cytologyLast36m: row.cytologyLast36m,
      hpvVaccineDose1: row.hpvVaccineDose1,
      sexualHealthLast12m: row.sexualHealthLast12m,
      mammographyLast24m: row.mammographyLast24m,
    }))
  }
}
