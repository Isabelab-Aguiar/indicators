import { Inject, Injectable } from '@nestjs/common'
import { eq, and } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import { c7Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C7EligibilityService } from './c7-eligibility.service'
import { C7_CRITERION_IDS, C7_CRITERION_POINTS, C7_CRITERION_LABELS } from './c7.constants'
import type { C7CriterionId, C7CriteriaResult, C7EligibilityResult } from '@repo/types'

type Database = NodePgDatabase<typeof schema>

function classify(pct: number): string {
  if (pct >= 80) return 'otimo'
  if (pct >= 60) return 'bom'
  if (pct >= 40) return 'suficiente'
  return 'regular'
}

function evaluateCriteria(row: typeof c7Scores.$inferSelect): C7CriteriaResult {
  return {
    A: row.cytologyLast36m,
    B: row.hpvVaccineDose1,
    C: row.sexualHealthLast12m,
    D: row.mammographyLast24m,
  }
}

function computeScore(criteria: C7CriteriaResult, eligibility: C7EligibilityResult): number {
  return (Object.entries(C7_CRITERION_POINTS) as [C7CriterionId, number][]).reduce(
    (sum, [id, pts]) => (criteria[id] && eligibility[id] ? sum + pts : sum),
    0,
  )
}

@Injectable()
export class C7BreakdownService {
  constructor(
    @Inject(DATABASE_TOKEN) private readonly db: Database,
    private readonly eligibilityService: C7EligibilityService,
  ) {}

  async getBreakdown(tenant: TenantContextPayload, periodo?: string) {
    const conditions = periodo
      ? and(eq(c7Scores.esfId, tenant.esfId), eq(c7Scores.periodo, periodo))
      : eq(c7Scores.esfId, tenant.esfId)

    const rows = await this.db.query.c7Scores.findMany({ where: conditions })

    const patients = rows.map((row) => {
      const age = this.eligibilityService.calcAge(row.birthDate)
      const eligibility = this.eligibilityService.checkEligibility(age)
      const criteria = evaluateCriteria(row)
      const scoreMax = this.eligibilityService.getMaxPoints(eligibility)
      const rawScore = computeScore(criteria, eligibility)
      const pctScore = scoreMax > 0 ? Math.round((rawScore / scoreMax) * 1000) / 10 : 0
      const pendingCriteria = C7_CRITERION_IDS.filter((id) => eligibility[id] && !criteria[id])

      return {
        id: row.id,
        name: row.nome,
        age,
        microarea: row.microarea,
        acs: row.acs,
        criteria,
        eligibility,
        score: rawScore,
        scoreMax,
        pctScore,
        classification: classify(pctScore),
        pendingCriteria,
      }
    })

    const total = patients.length
    const avgScore =
      total > 0 ? Math.round((patients.reduce((s, p) => s + p.pctScore, 0) / total) * 10) / 10 : 0

    const criteriaStats = C7_CRITERION_IDS.map((id) => {
      const eligible = patients.filter((p) => p.eligibility[id])
      const achieved = eligible.filter((p) => p.criteria[id])
      return {
        id,
        label: C7_CRITERION_LABELS[id],
        eligible: eligible.length,
        achieved: achieved.length,
        notAchieved: eligible.length - achieved.length,
        total,
        rate: eligible.length > 0 ? Math.round((achieved.length / eligible.length) * 1000) / 10 : 0,
      }
    })

    return { total, avgScore, classification: classify(avgScore), criteriaStats, patients }
  }
}
