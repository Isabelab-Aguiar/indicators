import { Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import { c6Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C6_CRITERION_IDS, C6_CRITERION_LABELS, C6_CRITERION_POINTS } from './c6.constants'
import type { C6CriteriaResult, C6CriterionId } from '@repo/types'

type Database = NodePgDatabase<typeof schema>

function classify(pct: number): string {
  if (pct >= 80) return 'otimo'
  if (pct >= 60) return 'bom'
  if (pct >= 40) return 'suficiente'
  return 'regular'
}

function evaluateCriteria(row: typeof c6Scores.$inferSelect): C6CriteriaResult {
  return {
    A: row.consultationsLast12m >= 1,
    B: row.weightHeightLast12m,
    C: row.acsVisitsLast12m >= 2 && row.acsVisitsIntervalDays >= 30,
    D: row.influenzaVaccineLast12m,
  }
}

function computeScore(criteria: C6CriteriaResult): number {
  return (Object.entries(C6_CRITERION_POINTS) as [C6CriterionId, number][]).reduce(
    (sum, [id, pts]) => (criteria[id] ? sum + pts : sum),
    0,
  )
}

@Injectable()
export class C6BreakdownService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async getBreakdown(tenant: TenantContextPayload, periodo?: string) {
    const conditions = periodo
      ? and(eq(c6Scores.esfId, tenant.esfId), eq(c6Scores.periodo, periodo))
      : eq(c6Scores.esfId, tenant.esfId)

    const rows = await this.db.query.c6Scores.findMany({ where: conditions })

    const patients = rows.map((row) => {
      const criteria = evaluateCriteria(row)
      const score = computeScore(criteria)
      const pendingCriteria = C6_CRITERION_IDS.filter((id) => !criteria[id])

      return {
        id: row.id,
        name: row.nome,
        birthDate: row.birthDate,
        microarea: row.microarea,
        acs: row.acs,
        criteria,
        score,
        classification: classify(score),
        pendingCriteria,
      }
    })

    const total = patients.length
    const avgScore =
      total > 0 ? Math.round((patients.reduce((s, p) => s + p.score, 0) / total) * 10) / 10 : 0

    const criteriaStats = C6_CRITERION_IDS.map((id) => {
      const achieved = patients.filter((p) => p.criteria[id]).length
      return {
        id,
        label: C6_CRITERION_LABELS[id],
        achieved,
        notAchieved: total - achieved,
        total,
        pctAchieved: total > 0 ? Math.round((achieved / total) * 1000) / 10 : 0,
        pctNotAchieved: total > 0 ? Math.round(((total - achieved) / total) * 1000) / 10 : 0,
      }
    })

    return { total, avgScore, classification: classify(avgScore), criteriaStats, patients }
  }
}
