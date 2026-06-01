import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { eq, and } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DATABASE_TOKEN } from '../../database/database.module'
import { c7Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C7EligibilityService } from './c7-eligibility.service'
import { parseEsusCsv, ESUS_COL } from './c7-csv.helpers'
import {
  classify,
  computeScore,
  deriveEsusCriteria,
  parseDate,
  calcAge,
} from './c7-criteria.helpers'

type Database = NodePgDatabase<typeof schema>

@Injectable()
export class C7ImportService {
  constructor(
    @Inject(DATABASE_TOKEN) private readonly db: Database,
    private readonly eligibilityService: C7EligibilityService,
  ) {}

  async importCsv(csvContent: string, periodo: string, tenant: TenantContextPayload) {
    const rows = parseEsusCsv(csvContent)
    if (rows.length === 0) throw new BadRequestException('CSV sem dados de pacientes')

    const errors: { row: number; field: string; message: string }[] = []
    const warnings: { row: number; message: string }[] = []
    let imported = 0
    let updated = 0

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const nome = row[ESUS_COL.NOME]?.trim()

      if (!nome) {
        errors.push({ row: i + 1, field: 'Nome', message: 'Nome vazio' })
        continue
      }

      const birthDate = parseDate(row[ESUS_COL.DATA_NASCIMENTO] ?? '')
      if (!birthDate) {
        errors.push({
          row: i + 1,
          field: 'Data de nascimento',
          message: 'Data de nascimento inválida ou ausente',
        })
        continue
      }

      const microarea = row[ESUS_COL.MICROAREA]?.trim() ?? null
      const birthDateStr = birthDate.toISOString().split('T')[0]
      const eligibility = this.eligibilityService.checkEligibility(calcAge(birthDate))
      const criteria = deriveEsusCriteria(row)
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
          microarea,
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
