import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DATABASE_TOKEN } from '../../database/database.module'
import { c2Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { parseEsusCsv, ESUS_COL } from './c2-csv.helpers'
import { classify, computeScore, deriveEsusCriteria } from './c2-criteria.helpers'

type Database = NodePgDatabase<typeof schema>

@Injectable()
export class C2ImportService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async importCsv(csvContent: string, periodo: string, tenant: TenantContextPayload) {
    const rows = parseEsusCsv(csvContent)

    if (rows.length === 0) throw new BadRequestException('CSV sem dados de pacientes')

    const errors: { row: number; field: string; message: string }[] = []
    let imported = 0
    let updated = 0

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const nome = row[ESUS_COL.NOME]?.trim()

      if (!nome) {
        errors.push({ row: i + 1, field: 'Nome', message: 'Nome vazio' })
        continue
      }

      const criteria = deriveEsusCriteria(row)
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
