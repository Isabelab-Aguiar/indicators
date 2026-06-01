import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DATABASE_TOKEN } from '../../database/database.module'
import { c6Scores } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { C6_CRITERION_POINTS } from './c6.constants'
import type { C6CriteriaResult, C6CriterionId } from '@repo/types'

type Database = NodePgDatabase<typeof schema>

const ESUS_SEPARATOR = ';'

const ESUS_COL = {
  NOME: 'Nome',
  DATA_NASCIMENTO: 'Data de nascimento',
  DATA_ULTIMA_CONSULTA: 'Data da última consulta',
  DATA_PESO_ALTURA: 'Data da ultima medição de peso e altura',
  ULTIMAS_VISITAS: 'Últimas visitas domiciliares',
  QTD_VISITAS: 'Quantidade de visitas domiciliares',
  INFLUENZA: 'Influenza (últimos 12 meses)',
} as const

const classify = (score: number): string =>
  score >= 80 ? 'otimo' : score >= 60 ? 'bom' : score >= 40 ? 'suficiente' : 'regular'

const computeScore = (criteria: C6CriteriaResult): number =>
  (Object.entries(C6_CRITERION_POINTS) as [C6CriterionId, number][]).reduce(
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

function deriveEsusCriteria(row: Record<string, string>): C6CriteriaResult {
  const now = new Date()

  const dataUltimaConsulta = parseDate(row[ESUS_COL.DATA_ULTIMA_CONSULTA] ?? '')
  const criteriaA = dataUltimaConsulta !== null && monthsBetween(dataUltimaConsulta, now) <= 12

  const dataPesoAltura = parseDate(row[ESUS_COL.DATA_PESO_ALTURA] ?? '')
  const criteriaB = dataPesoAltura !== null && monthsBetween(dataPesoAltura, now) <= 12

  const visitDates = parseVisitDates(row[ESUS_COL.ULTIMAS_VISITAS] ?? '')
  let criteriaC = false
  if (visitDates.length >= 2) {
    visitDates.sort((a, b) => a.getTime() - b.getTime())
    const diffDays = Math.floor(
      (visitDates[visitDates.length - 1].getTime() - visitDates[0].getTime()) / 86_400_000,
    )
    const allInLast12m = visitDates.every((d) => monthsBetween(d, now) <= 12)
    criteriaC = allInLast12m && diffDays >= 30
  }

  const influenza = row[ESUS_COL.INFLUENZA]?.trim()
  const criteriaD = Boolean(influenza) && influenza !== '-' && influenza !== 'Sem registro'

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
export class C6ImportService {
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

      const birthDate = parseDate(row[ESUS_COL.DATA_NASCIMENTO] ?? '')
      const birthDateStr = birthDate?.toISOString().split('T')[0]

      const criteria = deriveEsusCriteria(row)
      const score = computeScore(criteria)

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
