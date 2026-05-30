import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DATABASE_TOKEN } from '../../database/database.module'
import { c2Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C2_CRITERION_POINTS, C2_CSV_TEMPLATE } from './c2.constants'
import type { C2CriteriaResult, C2CriterionId } from '@repo/types'

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

const computeScore = (criteria: C2CriteriaResult): number =>
  (Object.entries(C2_CRITERION_POINTS) as [C2CriterionId, number][]).reduce(
    (sum, [id, pts]) => (criteria[id] ? sum + pts : sum),
    0,
  )

@Injectable()
export class C2ImportService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  getTemplate(): string {
    return C2_CSV_TEMPLATE
  }

  async importCsv(csvContent: string, periodo: string, tenant: TenantContextPayload) {
    const lines = csvContent
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

    if (lines.length < 2) throw new BadRequestException('CSV vazio ou sem dados')

    const header = lines[0].split(',').map((h) => h.trim().toLowerCase())
    for (const col of ['nome', 'a', 'b', 'c', 'd', 'e']) {
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

      const criteria: C2CriteriaResult = {
        A: parseBool(cols[idx('a')] ?? ''),
        B: parseBool(cols[idx('b')] ?? ''),
        C: parseBool(cols[idx('c')] ?? ''),
        D: parseBool(cols[idx('d')] ?? ''),
        E: parseBool(cols[idx('e')] ?? ''),
      }

      const score = computeScore(criteria)

      const existing = await this.db.query.c2Scores.findFirst({
        where: and(
          eq(c2Scores.esfId, tenant.esfId),
          eq(c2Scores.nome, nome),
          eq(c2Scores.periodo, periodo),
        ),
      })

      if (existing) {
        await this.db
          .update(c2Scores)
          .set({
            firstConsultUntilDay30: criteria.A,
            prenatalConsults: criteria.B ? 9 : 0,
            weightHeightRecords: criteria.C ? 9 : 0,
            firstAcsVisitUntilDay30: criteria.D,
            secondAcsVisitUntilMonth6: criteria.D,
            vaccinesComplete: criteria.E,
            score: String(score),
            classification: classify(score),
            updatedAt: new Date(),
          })
          .where(eq(c2Scores.id, existing.id))
        updated++
      } else {
        await this.db.insert(c2Scores).values({
          esfId: tenant.esfId,
          nome,
          firstConsultUntilDay30: criteria.A,
          prenatalConsults: criteria.B ? 9 : 0,
          weightHeightRecords: criteria.C ? 9 : 0,
          firstAcsVisitUntilDay30: criteria.D,
          secondAcsVisitUntilMonth6: criteria.D,
          vaccinesComplete: criteria.E,
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
