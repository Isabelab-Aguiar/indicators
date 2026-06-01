import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DATABASE_TOKEN } from '../../database/database.module'
import { c5Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C5_CRITERION_POINTS } from './c5.constants'
import type { C5CriteriaResult, C5CriterionId } from '@repo/types'

type Database = NodePgDatabase<typeof schema>

const ESUS_SEPARATOR = ';'

const ESUS_COL = {
  NOME: 'Nome',
  DATA_ULTIMA_CONSULTA: 'Data da última consulta',
  ULTIMA_PA: 'Última medição de pressão arterial',
  DATA_ULTIMA_PA: 'Data da última medição de pressão arterial',
  DATA_PESO_ALTURA: 'Data da ultima medição de peso e altura',
  QTD_VISITAS: 'Quantidade de visitas domiciliares',
  ULTIMAS_VISITAS: 'Últimas visitas domiciliares',
} as const

const classify = (score: number): string =>
  score >= 80 ? 'otimo' : score >= 60 ? 'bom' : score >= 40 ? 'suficiente' : 'regular'

const computeScore = (criteria: C5CriteriaResult): number =>
  (Object.entries(C5_CRITERION_POINTS) as [C5CriterionId, number][]).reduce(
    (sum, [id, pts]) => (criteria[id] ? sum + pts : sum),
    0,
  )

function parseDate(value: string): Date | null {
  const clean = value?.trim()
  if (!clean || clean === '-') return null
  const br = clean.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (br) return new Date(`${br[3]}-${br[2]}-${br[1]}`)
  const iso = clean.match(/^\d{4}-\d{2}-\d{2}$/)
  if (iso) return new Date(clean)
  return null
}

function monthsBetween(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
}

function parseVisitDates(raw: string): Date[] {
  if (!raw || raw.trim() === '-') return []
  return raw
    .split(' e ')
    .map((s) => parseDate(s.trim()))
    .filter((d): d is Date => d !== null)
}

function deriveEsusCriteria(row: Record<string, string>): C5CriteriaResult {
  const now = new Date()

  const dataUltimaConsulta = parseDate(row[ESUS_COL.DATA_ULTIMA_CONSULTA] ?? '')
  const criteriaA = dataUltimaConsulta !== null && monthsBetween(dataUltimaConsulta, now) <= 6

  const dataUltimaPA = parseDate(row[ESUS_COL.DATA_ULTIMA_PA] ?? '')
  const ultimaPA = row[ESUS_COL.ULTIMA_PA]?.trim()
  const criteriaB =
    dataUltimaPA !== null &&
    ultimaPA !== '-' &&
    Boolean(ultimaPA) &&
    monthsBetween(dataUltimaPA, now) <= 6

  const dataPesoAltura = parseDate(row[ESUS_COL.DATA_PESO_ALTURA] ?? '')
  const criteriaC = dataPesoAltura !== null && monthsBetween(dataPesoAltura, now) <= 12

  const visitDates = parseVisitDates(row[ESUS_COL.ULTIMAS_VISITAS] ?? '')
  let criteriaD = false
  if (visitDates.length >= 2) {
    visitDates.sort((a, b) => a.getTime() - b.getTime())
    const diffDays = Math.floor(
      (visitDates[visitDates.length - 1].getTime() - visitDates[0].getTime()) / 86_400_000,
    )
    const allInLast12m = visitDates.every((d) => monthsBetween(d, now) <= 12)
    criteriaD = allInLast12m && diffDays >= 30
  }

  return { A: criteriaA, B: criteriaB, C: criteriaC, D: criteriaD }
}

function parseEsusCsv(csvContent: string): Record<string, string>[] {
  const lines = csvContent.split('\n').map((l) => l.trimEnd())
  const headerLineIndex = lines.findIndex((l) => l.startsWith('Nome' + ESUS_SEPARATOR))
  if (headerLineIndex === -1) {
    throw new BadRequestException(
      'Formato de CSV não reconhecido. Exporte o relatório de Acompanhamento de Condições de Saúde do e-SUS.',
    )
  }
  const columns = lines[headerLineIndex]
    .split(ESUS_SEPARATOR)
    .map((h) => h.trim().replace(/^"|"$/g, ''))
  return lines
    .slice(headerLineIndex + 1)
    .filter((l) => l.trim().length > 0)
    .map((line) => {
      const fields = line.split(ESUS_SEPARATOR).map((f) => f.trim().replace(/^"|"$/g, ''))
      const row: Record<string, string> = {}
      columns.forEach((col, i) => {
        row[col] = fields[i] ?? ''
      })
      return row
    })
}

@Injectable()
export class C5ImportService {
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
