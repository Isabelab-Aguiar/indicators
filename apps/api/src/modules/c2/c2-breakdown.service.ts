import { Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DATABASE_TOKEN } from '../../database/database.module'
import { c2Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C2_CRITERION_IDS, C2_CRITERION_LABELS, C2_CRITERION_POINTS } from './c2.constants'
import type { C2CriteriaResult, C2CriterionId } from '@repo/types'

type Database = NodePgDatabase<typeof schema>

const C2_MIN_AGE_DAYS: Record<C2CriterionId, number> = {
  A: 30,
  B: 600,
  C: 600,
  D: 180,
  E: 365,
}

function classify(score: number): string {
  if (score >= 80) return 'otimo'
  if (score >= 60) return 'bom'
  if (score >= 40) return 'suficiente'
  return 'regular'
}

function ageInDays(birthDate: string | null): number | null {
  if (!birthDate) return null
  const diff = Date.now() - new Date(birthDate).getTime()
  return Math.floor(diff / 86_400_000)
}

function getNotApplicable(ageDays: number | null): C2CriterionId[] {
  if (ageDays === null) return []
  return C2_CRITERION_IDS.filter((id) => ageDays < C2_MIN_AGE_DAYS[id])
}

function evaluateCriteria(row: typeof c2Scores.$inferSelect): C2CriteriaResult {
  return {
    A: row.firstConsultUntilDay30,
    B: row.prenatalConsults >= 9,
    C: row.weightHeightRecords >= 9,
    D: row.firstAcsVisitUntilDay30 && row.secondAcsVisitUntilMonth6,
    E: row.vaccinesComplete,
  }
}

function computeScore(criteria: C2CriteriaResult, notApplicable: C2CriterionId[]): number {
  return (Object.entries(C2_CRITERION_POINTS) as [C2CriterionId, number][]).reduce(
    (sum, [id, pts]) => (criteria[id] && !notApplicable.includes(id) ? sum + pts : sum),
    0,
  )
}

@Injectable()
export class C2BreakdownService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async getBreakdown(tenant: TenantContextPayload, periodo?: string) {
    const conditions = periodo
      ? and(eq(c2Scores.esfId, tenant.esfId), eq(c2Scores.periodo, periodo))
      : eq(c2Scores.esfId, tenant.esfId)

    const rows = await this.db.query.c2Scores.findMany({ where: conditions })

    const patients = rows.map((row) => {
      const age = ageInDays(row.birthDate)
      const notApplicable = getNotApplicable(age)
      const criteria = evaluateCriteria(row)
      const score = computeScore(criteria, notApplicable)
      return {
        id: row.id,
        name: row.nome,
        microarea: row.microarea,
        acs: row.acs,
        birthDate: row.birthDate,
        ageInDays: age,
        criteria,
        notApplicableCriteria: notApplicable,
        score,
        classification: classify(score),
        pendingCriteria: C2_CRITERION_IDS.filter(
          (id) => !criteria[id] && !notApplicable.includes(id),
        ),
      }
    })

    const total = patients.length
    const avgScore =
      total > 0 ? Math.round((patients.reduce((s, p) => s + p.score, 0) / total) * 10) / 10 : 0

    const criteriaStats = C2_CRITERION_IDS.map((id) => {
      const applicable = patients.filter((p) => !p.notApplicableCriteria.includes(id))
      const applicableTotal = applicable.length
      const achieved = applicable.filter((p) => p.criteria[id]).length
      const notAchieved = applicableTotal - achieved
      return {
        id,
        label: C2_CRITERION_LABELS[id],
        achieved,
        notAchieved,
        total: applicableTotal,
        pctAchieved: applicableTotal > 0 ? Math.round((achieved / applicableTotal) * 1000) / 10 : 0,
        pctNotAchieved:
          applicableTotal > 0 ? Math.round((notAchieved / applicableTotal) * 1000) / 10 : 0,
      }
    })

    return { total, avgScore, classification: classify(avgScore), criteriaStats, patients }
  }
}
