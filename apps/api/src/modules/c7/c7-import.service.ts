import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DATABASE_TOKEN } from '../../database/database.module'
import { c7Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { NewC7Score } from '../../database/schema'
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
    const values: NewC7Score[] = []

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
      const eligibility = this.eligibilityService.checkEligibility(calcAge(birthDate))
      const criteria = deriveEsusCriteria(row)
      const { score, scoreMax, pct } = computeScore(criteria, eligibility)

      values.push({
        esfId: tenant.esfId,
        nome,
        periodo,
        birthDate: birthDate.toISOString().split('T')[0],
        microarea,
        cytologyLast36m: criteria.A,
        hpvVaccineDose1: criteria.B,
        sexualHealthLast12m: criteria.C,
        mammographyLast24m: criteria.D,
        score: String(score),
        scoreMax: String(scoreMax),
        classification: classify(pct),
      })
    }

    if (values.length > 0) {
      await this.db
        .insert(c7Scores)
        .values(values)
        .onConflictDoUpdate({
          target: [c7Scores.esfId, c7Scores.nome, c7Scores.periodo],
          set: {
            birthDate: sql`excluded.birth_date`,
            microarea: sql`excluded.microarea`,
            cytologyLast36m: sql`excluded.cytology_last36m`,
            hpvVaccineDose1: sql`excluded.hpv_vaccine_dose1`,
            sexualHealthLast12m: sql`excluded.sexual_health_last12m`,
            mammographyLast24m: sql`excluded.mammography_last24m`,
            score: sql`excluded.score`,
            scoreMax: sql`excluded.score_max`,
            classification: sql`excluded.classification`,
            updatedAt: new Date(),
          },
        })
    }

    return { processed: values.length, errors, warnings }
  }
}
