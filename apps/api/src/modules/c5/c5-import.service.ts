import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import { c5Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C5_CRITERION_POINTS, C5_CSV_TEMPLATE } from './c5.constants'
import type { C5CriteriaResult, C5CriterionId } from '@repo/types'

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

function parseBool(val: string): boolean {
  return BOOL_MAP[val.toLowerCase().trim()] ?? false
}

function classify(score: number): string {
  if (score >= 80) return 'otimo'
  if (score >= 60) return 'bom'
  if (score >= 40) return 'suficiente'
  return 'regular'
}

function computeScore(criteria: C5CriteriaResult): number {
  return (Object.entries(C5_CRITERION_POINTS) as [C5CriterionId, number][]).reduce(
    (sum, [id, pts]) => (criteria[id] ? sum + pts : sum),
    0,
  )
}

@Injectable()
export class C5ImportService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  getTemplate(): string {
    return C5_CSV_TEMPLATE
  }

  async importCsv(csvContent: string, periodo: string, tenant: TenantContextPayload) {
    const lines = csvContent
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    if (lines.length < 2) throw new BadRequestException('CSV vazio ou sem dados')

    const header = lines[0].split(',').map((h) => h.trim().toLowerCase())
    const required = ['nome', 'a', 'b', 'c', 'd']
    for (const col of required) {
      if (!header.includes(col)) throw new BadRequestException(`Coluna obrigatória ausente: ${col}`)
    }

    const idxOf = (col: string) => header.indexOf(col)
    const errors: { row: number; field: string; message: string }[] = []
    let imported = 0
    let updated = 0

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim())
      const nome = cols[idxOf('nome')]?.replace(/^"|"$/g, '')

      if (!nome) {
        errors.push({ row: i + 1, field: 'nome', message: 'Nome vazio' })
        continue
      }

      const criteria: C5CriteriaResult = {
        A: parseBool(cols[idxOf('a')] ?? ''),
        B: parseBool(cols[idxOf('b')] ?? ''),
        C: parseBool(cols[idxOf('c')] ?? ''),
        D: parseBool(cols[idxOf('d')] ?? ''),
      }

      const score = computeScore(criteria)

      const existing = await this.db.query.c5Scores.findFirst({
        where: and(
          eq(c5Scores.esfId, tenant.esfId),
          eq(c5Scores.nome, nome),
          eq(c5Scores.periodo, periodo),
        ),
      })

      if (existing) {
        await this.db
          .update(c5Scores)
          .set({
            consultationsLast6m: criteria.A ? 1 : 0,
            bloodPressureLast6m: criteria.B ? 1 : 0,
            weightHeightLast12m: criteria.C,
            acsVisitsLast12m: criteria.D ? 2 : 0,
            acsVisitsIntervalDays: criteria.D ? 30 : 0,
            score: String(score),
            classification: classify(score),
            updatedAt: new Date(),
          })
          .where(eq(c5Scores.id, existing.id))
        updated++
      } else {
        await this.db.insert(c5Scores).values({
          esfId: tenant.esfId,
          nome,
          consultationsLast6m: criteria.A ? 1 : 0,
          bloodPressureLast6m: criteria.B ? 1 : 0,
          weightHeightLast12m: criteria.C,
          acsVisitsLast12m: criteria.D ? 2 : 0,
          acsVisitsIntervalDays: criteria.D ? 30 : 0,
          score: String(score),
          classification: classify(score),
          periodo,
        })
        imported++
      }
    }

    return { imported, updated, errors, warnings: [] }
  }
}
