import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { eq, and } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import { c7Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C7EligibilityService } from './c7-eligibility.service'
import { C7_CRITERION_POINTS, C7_CSV_TEMPLATE } from './c7.constants'
import type { C7CriterionId, C7CriteriaResult, C7EligibilityResult } from '@repo/types'

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

function classify(pct: number): string {
  if (pct >= 80) return 'otimo'
  if (pct >= 60) return 'bom'
  if (pct >= 40) return 'suficiente'
  return 'regular'
}

function computeScore(
  criteria: C7CriteriaResult,
  eligibility: C7EligibilityResult,
): { score: number; scoreMax: number; pct: number } {
  const score = (Object.entries(C7_CRITERION_POINTS) as [C7CriterionId, number][]).reduce(
    (sum, [id, pts]) => (criteria[id] && eligibility[id] ? sum + pts : sum),
    0,
  )
  const scoreMax = (Object.entries(C7_CRITERION_POINTS) as [C7CriterionId, number][]).reduce(
    (sum, [id, pts]) => (eligibility[id] ? sum + pts : sum),
    0,
  )
  const pct = scoreMax > 0 ? Math.round((score / scoreMax) * 1000) / 10 : 0
  return { score, scoreMax, pct }
}

@Injectable()
export class C7ImportService {
  constructor(
    @Inject(DATABASE_TOKEN) private readonly db: Database,
    private readonly eligibilityService: C7EligibilityService,
  ) {}

  getTemplate(): string {
    return C7_CSV_TEMPLATE
  }

  async importCsv(csvContent: string, periodo: string, tenant: TenantContextPayload) {
    const lines = csvContent
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    if (lines.length < 2) throw new BadRequestException('CSV vazio ou sem dados')

    const header = lines[0].split(',').map((h) => h.trim().toLowerCase())
    const required = ['nome', 'idade', 'a', 'b', 'c', 'd']
    for (const col of required) {
      if (!header.includes(col)) throw new BadRequestException(`Coluna obrigatória ausente: ${col}`)
    }

    const idxOf = (col: string) => header.indexOf(col)
    const errors: { row: number; field: string; message: string }[] = []
    const warnings: { row: number; message: string }[] = []
    let imported = 0
    let updated = 0

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim())
      const nome = cols[idxOf('nome')]?.replace(/^"|"$/g, '')
      const idadeRaw = cols[idxOf('idade')]
      const age = parseInt(idadeRaw, 10)

      if (!nome) {
        errors.push({ row: i + 1, field: 'nome', message: 'Nome vazio' })
        continue
      }
      if (isNaN(age) || age < 0 || age > 120) {
        errors.push({ row: i + 1, field: 'idade', message: 'Idade inválida' })
        continue
      }

      const eligibility = this.eligibilityService.checkEligibility(age)
      const criteria: C7CriteriaResult = {
        A: parseBool(cols[idxOf('a')] ?? ''),
        B: parseBool(cols[idxOf('b')] ?? ''),
        C: parseBool(cols[idxOf('c')] ?? ''),
        D: parseBool(cols[idxOf('d')] ?? ''),
      }

      const eligibilityIds: C7CriterionId[] = ['A', 'B', 'C', 'D']
      for (const id of eligibilityIds) {
        if (criteria[id] && !eligibility[id]) {
          warnings.push({
            row: i + 1,
            message: `Critério ${id} marcado, mas paciente fora da faixa elegível`,
          })
        }
      }

      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - age)
      const birthDateStr = birthDate.toISOString().split('T')[0]

      const { score, scoreMax, pct } = computeScore(criteria, eligibility)

      const existing = await this.db.query.c7Scores.findFirst({
        where: and(
          eq(c7Scores.esfId, tenant.esfId),
          eq(c7Scores.nome, nome),
          eq(c7Scores.periodo, periodo),
        ),
      })

      if (existing) {
        await this.db
          .update(c7Scores)
          .set({
            cytologyLast36m: criteria.A,
            hpvVaccineDose1: criteria.B,
            sexualHealthLast12m: criteria.C,
            mammographyLast24m: criteria.D,
            score: String(score),
            scoreMax: String(scoreMax),
            classification: classify(pct),
            updatedAt: new Date(),
          })
          .where(eq(c7Scores.id, existing.id))
        updated++
      } else {
        await this.db.insert(c7Scores).values({
          esfId: tenant.esfId,
          nome,
          birthDate: birthDateStr,
          cytologyLast36m: criteria.A,
          hpvVaccineDose1: criteria.B,
          sexualHealthLast12m: criteria.C,
          mammographyLast24m: criteria.D,
          score: String(score),
          scoreMax: String(scoreMax),
          classification: classify(pct),
          periodo,
        })
        imported++
      }
    }

    return { imported, updated, errors, warnings }
  }
}
