import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DATABASE_TOKEN } from '../../database/database.module'
import { c4Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C4_CRITERION_POINTS, C4_CSV_TEMPLATE } from './c4.constants'
import type { C4CriteriaResult, C4CriterionId } from '@repo/types'

type Database = NodePgDatabase<typeof schema>

const BOOL_MAP: Record<string, boolean> = {
  sim: true,
  yes: true,
  '1': true,
  true: true,
  não: false,
  nao: false,
  no: false,
  '0': false,
  false: false,
}

const parseBool = (val: string): boolean => BOOL_MAP[val.toLowerCase().trim()] ?? false

const classify = (score: number): string =>
  score >= 80 ? 'otimo' : score >= 60 ? 'bom' : score >= 40 ? 'suficiente' : 'regular'

const computeScore = (criteria: C4CriteriaResult): number =>
  (Object.entries(C4_CRITERION_POINTS) as [C4CriterionId, number][]).reduce(
    (sum, [id, pts]) => (criteria[id] ? sum + pts : sum),
    0,
  )

@Injectable()
export class C4ImportService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  getTemplate(): string {
    return C4_CSV_TEMPLATE
  }

  async importCsv(csvContent: string, periodo: string, tenant: TenantContextPayload) {
    const lines = csvContent
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    if (lines.length < 2) throw new BadRequestException('CSV vazio ou sem dados')

    const header = lines[0].split(',').map((h) => h.trim().toLowerCase())
    for (const col of ['nome', 'a', 'b', 'c', 'd', 'e', 'f']) {
      if (!header.includes(col)) throw new BadRequestException(`Coluna ausente: ${col}`)
    }

    const idx = (col: string) => header.indexOf(col)
    const errors: { row: number; field: string; message: string }[] = []
    let imported = 0
    let updated = 0

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim())
      const nome = cols[idx('nome')]?.replace(/^"|"$/g, '')
      if (!nome) {
        errors.push({ row: i + 1, field: 'nome', message: 'Nome vazio' })
        continue
      }

      const criteria: C4CriteriaResult = {
        A: parseBool(cols[idx('a')] ?? ''),
        B: parseBool(cols[idx('b')] ?? ''),
        C: parseBool(cols[idx('c')] ?? ''),
        D: parseBool(cols[idx('d')] ?? ''),
        E: parseBool(cols[idx('e')] ?? ''),
        F: parseBool(cols[idx('f')] ?? ''),
      }

      const score = computeScore(criteria)
      const existing = await this.db.query.c4Scores.findFirst({
        where: and(
          eq(c4Scores.esfId, tenant.esfId),
          eq(c4Scores.nome, nome),
          eq(c4Scores.periodo, periodo),
        ),
      })

      if (existing) {
        await this.db
          .update(c4Scores)
          .set({
            consultationsLast6m: criteria.A ? 1 : 0,
            bloodPressureLast6m: criteria.B ? 1 : 0,
            weightHeightLast12m: criteria.C,
            acsVisitsLast12m: criteria.D ? 2 : 0,
            acsVisitsIntervalDays: criteria.D ? 30 : 0,
            hba1cLast12m: criteria.E,
            feetEvaluationLast12m: criteria.F,
            score: String(score),
            classification: classify(score),
            updatedAt: new Date(),
          })
          .where(eq(c4Scores.id, existing.id))
        updated++
      } else {
        await this.db.insert(c4Scores).values({
          esfId: tenant.esfId,
          nome,
          consultationsLast6m: criteria.A ? 1 : 0,
          bloodPressureLast6m: criteria.B ? 1 : 0,
          weightHeightLast12m: criteria.C,
          acsVisitsLast12m: criteria.D ? 2 : 0,
          acsVisitsIntervalDays: criteria.D ? 30 : 0,
          hba1cLast12m: criteria.E,
          feetEvaluationLast12m: criteria.F,
          score: String(score),
          classification: classify(score),
          periodo,
        })
        imported++
      }
    }

    return { imported, updated, errors }
  }
}
