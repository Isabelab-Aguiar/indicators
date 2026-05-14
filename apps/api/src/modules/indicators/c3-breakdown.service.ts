import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import { pregnantWomen } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'

type Database = NodePgDatabase<typeof schema>
type Woman = typeof pregnantWomen.$inferSelect

const C3_CRITERIA = [
  { id: 'A', points: 25 },
  { id: 'B', points: 25 },
  { id: 'C', points: 25 },
  { id: 'D', points: 25 },
] as const

function evaluateCriteria(woman: Woman): string[] {
  const met: string[] = []
  if (woman.prenatalConsultations >= 6) met.push('A')
  if (
    woman.hivExam1stTrimester === 'positive' &&
    woman.syphilisExam1stTrimester === 'positive' &&
    woman.hepatitisBExam1stTrimester === 'positive' &&
    woman.hepatitisCExam1stTrimester === 'positive'
  ) {
    met.push('B')
  }
  if (woman.dentalAppointments >= 1) met.push('C')
  if (woman.dtpaRegistered) met.push('D')
  return met
}

function classify(score: number): string {
  if (score >= 80) return 'otimo'
  if (score >= 60) return 'bom'
  if (score >= 40) return 'suficiente'
  return 'regular'
}

@Injectable()
export class C3BreakdownService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async getBreakdown(tenant: TenantContextPayload) {
    const women = await this.db.query.pregnantWomen.findMany({
      where: eq(pregnantWomen.esfId, tenant.esfId),
    })

    const patients = women.map((w) => {
      const criteriaMet = evaluateCriteria(w)
      const score = criteriaMet.reduce(
        (sum, id) => sum + (C3_CRITERIA.find((c) => c.id === id)?.points ?? 0),
        0,
      )
      return {
        id: w.id,
        name: w.name,
        cpf: w.cpf,
        microarea: w.microarea,
        score,
        classification: classify(score),
        criteriaMet,
      }
    })

    const total = patients.length
    const avgScore = total > 0 ? patients.reduce((s, p) => s + p.score, 0) / total : 0

    const criteria = C3_CRITERIA.map(({ id }) => {
      const achieved = patients.filter((p) => p.criteriaMet.includes(id)).length
      return {
        id,
        achieved,
        notAchieved: total - achieved,
        rate: total > 0 ? Math.round((achieved / total) * 1000) / 10 : 0,
      }
    })

    const microareaMap = new Map<string, { total: number; sum: number; meeting: number }>()
    for (const p of patients) {
      const entry = microareaMap.get(p.microarea) ?? { total: 0, sum: 0, meeting: 0 }
      entry.total += 1
      entry.sum += p.score
      if (p.score >= 80) entry.meeting += 1
      microareaMap.set(p.microarea, entry)
    }
    const byMicroarea = Array.from(microareaMap.entries())
      .map(([microarea, v]) => ({
        microarea,
        total: v.total,
        avgScore: Math.round((v.sum / v.total) * 10) / 10,
        meetingTarget: v.meeting,
      }))
      .sort((a, b) => a.microarea.localeCompare(b.microarea, 'pt-BR'))

    return {
      total,
      avgScore: Math.round(avgScore * 10) / 10,
      classification: classify(avgScore),
      criteria,
      patients,
      byMicroarea,
    }
  }
}
