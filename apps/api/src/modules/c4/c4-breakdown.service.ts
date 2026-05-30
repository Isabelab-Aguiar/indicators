import { Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DATABASE_TOKEN } from '../../database/database.module'
import { c4Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C4_CRITERION_IDS, C4_CRITERION_LABELS, C4_CRITERION_POINTS } from './c4.constants'
import type { C4CriteriaResult, C4CriterionId } from '@repo/types'

type Database = NodePgDatabase<typeof schema>

function classify(score: number): string {
  if (score >= 80) return 'otimo'
  if (score >= 60) return 'bom'
  if (score >= 40) return 'suficiente'
  return 'regular'
}

function evaluateCriteria(row: typeof c4Scores.$inferSelect): C4CriteriaResult {
  return {
    A: row.consultationsLast6m >= 1,
    B: row.bloodPressureLast6m >= 1,
    C: row.weightHeightLast12m,
    D: row.acsVisitsLast12m >= 2 && row.acsVisitsIntervalDays >= 30,
    E: row.hba1cLast12m,
    F: row.feetEvaluationLast12m,
  }
}

function computeScore(criteria: C4CriteriaResult): number {
  return (Object.entries(C4_CRITERION_POINTS) as [C4CriterionId, number][]).reduce(
    (sum, [id, pts]) => (criteria[id] ? sum + pts : sum),
    0,
  )
}

@Injectable()
export class C4BreakdownService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async getBreakdown(tenant: TenantContextPayload, periodo?: string) {
    const conditions = periodo
      ? and(eq(c4Scores.esfId, tenant.esfId), eq(c4Scores.periodo, periodo))
      : eq(c4Scores.esfId, tenant.esfId)

    const rows = await this.db.query.c4Scores.findMany({ where: conditions })

    const patients = rows.map((row) => {
      const criteria = evaluateCriteria(row)
      const score = computeScore(criteria)
      return {
        id: row.id,
        name: row.nome,
        microarea: row.microarea,
        acs: row.acs,
        criteria,
        score,
        classification: classify(score),
        pendingCriteria: C4_CRITERION_IDS.filter((id) => !criteria[id]),
      }
    })

    const total = patients.length
    const avgScore =
      total > 0 ? Math.round((patients.reduce((s, p) => s + p.score, 0) / total) * 10) / 10 : 0

    const criteriaStats = C4_CRITERION_IDS.map((id) => {
      const achieved = patients.filter((p) => p.criteria[id]).length
      return {
        id,
        label: C4_CRITERION_LABELS[id],
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
