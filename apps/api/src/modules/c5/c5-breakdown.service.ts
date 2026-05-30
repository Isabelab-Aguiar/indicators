import { Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import { c5Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C5_CRITERION_IDS, C5_CRITERION_LABELS, C5_CRITERION_POINTS } from './c5.constants'
import type { C5CriteriaResult, C5CriterionId } from '@repo/types'

type Database = NodePgDatabase<typeof schema>

function classify(pct: number): string {
  if (pct >= 80) return 'otimo'
  if (pct >= 60) return 'bom'
  if (pct >= 40) return 'suficiente'
  return 'regular'
}

function evaluateCriteria(row: typeof c5Scores.$inferSelect): C5CriteriaResult {
  return {
    A: row.consultationsLast6m >= 1,
    B: row.bloodPressureLast6m >= 1,
    C: row.weightHeightLast12m,
    D: row.acsVisitsLast12m >= 2 && row.acsVisitsIntervalDays >= 30,
  }
}

function computeScore(criteria: C5CriteriaResult): number {
  return (Object.entries(C5_CRITERION_POINTS) as [C5CriterionId, number][]).reduce(
    (sum, [id, pts]) => (criteria[id] ? sum + pts : sum),
    0,
  )
}

@Injectable()
export class C5BreakdownService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async getBreakdown(tenant: TenantContextPayload, periodo?: string) {
    const conditions = periodo
      ? and(eq(c5Scores.esfId, tenant.esfId), eq(c5Scores.periodo, periodo))
      : eq(c5Scores.esfId, tenant.esfId)

    const rows = await this.db.query.c5Scores.findMany({ where: conditions })

    const patients = rows.map((row) => {
      const criteria = evaluateCriteria(row)
      const score = computeScore(criteria)
      const pendingCriteria = C5_CRITERION_IDS.filter((id) => !criteria[id])

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

    const criteriaStats = C5_CRITERION_IDS.map((id) => {
      const achieved = patients.filter((p) => p.criteria[id]).length
      return {
        id,
        label: C5_CRITERION_LABELS[id],
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
