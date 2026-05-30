import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import { c6Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C6_CRITERION_POINTS, C6_CSV_TEMPLATE } from './c6.constants'
import type { C6CriteriaResult, C6CriterionId } from '@repo/types'

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

function computeScore(criteria: C6CriteriaResult): number {
  return (Object.entries(C6_CRITERION_POINTS) as [C6CriterionId, number][]).reduce(
    (sum, [id, pts]) => (criteria[id] ? sum + pts : sum),
    0,
  )
}

@Injectable()
export class C6ImportService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  getTemplate(): string {
    return C6_CSV_TEMPLATE
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
    const hasIdade = header.includes('idade')
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

      const criteria: C6CriteriaResult = {
        A: parseBool(cols[idxOf('a')] ?? ''),
        B: parseBool(cols[idxOf('b')] ?? ''),
        C: parseBool(cols[idxOf('c')] ?? ''),
        D: parseBool(cols[idxOf('d')] ?? ''),
      }

      const score = computeScore(criteria)

      let birthDateStr: string | undefined
      if (hasIdade) {
        const age = parseInt(cols[idxOf('idade')] ?? '', 10)
        if (!isNaN(age) && age >= 60 && age <= 120) {
          const d = new Date()
          d.setFullYear(d.getFullYear() - age)
          birthDateStr = d.toISOString().split('T')[0]
        }
      }

      const existing = await this.db.query.c6Scores.findFirst({
        where: and(
          eq(c6Scores.esfId, tenant.esfId),
          eq(c6Scores.nome, nome),
          eq(c6Scores.periodo, periodo),
        ),
      })

      if (existing) {
        await this.db
          .update(c6Scores)
          .set({
            consultationsLast12m: criteria.A ? 1 : 0,
            weightHeightLast12m: criteria.B,
            acsVisitsLast12m: criteria.C ? 2 : 0,
            acsVisitsIntervalDays: criteria.C ? 30 : 0,
            influenzaVaccineLast12m: criteria.D,
            score: String(score),
            classification: classify(score),
            updatedAt: new Date(),
          })
          .where(eq(c6Scores.id, existing.id))
        updated++
      } else {
        await this.db.insert(c6Scores).values({
          esfId: tenant.esfId,
          nome,
          birthDate: birthDateStr,
          consultationsLast12m: criteria.A ? 1 : 0,
          weightHeightLast12m: criteria.B,
          acsVisitsLast12m: criteria.C ? 2 : 0,
          acsVisitsIntervalDays: criteria.C ? 30 : 0,
          influenzaVaccineLast12m: criteria.D,
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
