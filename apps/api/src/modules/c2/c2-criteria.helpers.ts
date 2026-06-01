import { C2_CRITERION_POINTS } from './c2.constants'
import { ESUS_COL } from './c2-csv.helpers'
import type { C2CriteriaResult, C2CriterionId } from '@repo/types'

export const classify = (score: number): string =>
  score >= 80 ? 'otimo' : score >= 60 ? 'bom' : score >= 40 ? 'suficiente' : 'regular'

export const computeScore = (criteria: C2CriteriaResult): number =>
  (Object.entries(C2_CRITERION_POINTS) as [C2CriterionId, number][]).reduce(
    (sum, [id, pts]) => (criteria[id] ? sum + pts : sum),
    0,
  )

function parseDateBR(value: string): Date | null {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null
  return new Date(`${match[3]}-${match[2]}-${match[1]}`)
}

function parseDateISO(value: string): Date | null {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  return new Date(value.trim())
}

export function parseDate(value: string): Date | null {
  return parseDateBR(value) ?? parseDateISO(value)
}

export function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / 86_400_000)
}

function hasMinDoses(vacineField: string, minDoses: number): boolean {
  if (!vacineField || vacineField.trim() === '-') return false
  return (
    vacineField
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean).length >= minDoses
  )
}

export function deriveEsusCriteria(row: Record<string, string>): C2CriteriaResult {
  const dataNascimento = parseDate(row[ESUS_COL.DATA_NASCIMENTO] ?? '')
  const dataPrimeiraConsulta = parseDate(row[ESUS_COL.DATA_PRIMEIRA_CONSULTA] ?? '')
  const qtdConsultas = parseInt(row[ESUS_COL.QTD_CONSULTAS] ?? '0', 10)
  const qtdMedicoes = parseInt(row[ESUS_COL.QTD_MEDICOES] ?? '0', 10)
  const dataPrimeiraVisita = parseDate(row[ESUS_COL.DATA_PRIMEIRA_VISITA] ?? '')
  const dataSegundaVisita = parseDate(row[ESUS_COL.DATA_SEGUNDA_VISITA] ?? '')

  const criteriaA =
    dataNascimento !== null &&
    dataPrimeiraConsulta !== null &&
    daysBetween(dataNascimento, dataPrimeiraConsulta) <= 30

  const criteriaB = !isNaN(qtdConsultas) && qtdConsultas >= 7
  const criteriaC = !isNaN(qtdMedicoes) && qtdMedicoes >= 7

  const criteriaD =
    dataNascimento !== null &&
    dataPrimeiraVisita !== null &&
    daysBetween(dataNascimento, dataPrimeiraVisita) <= 30 &&
    dataNascimento !== null &&
    dataSegundaVisita !== null &&
    daysBetween(dataNascimento, dataSegundaVisita) <= 180

  const criteriaE =
    hasMinDoses(row[ESUS_COL.VACINA_PENTA] ?? '', 4) &&
    hasMinDoses(row[ESUS_COL.VACINA_POLIO] ?? '', 4) &&
    hasMinDoses(row[ESUS_COL.VACINA_SCR] ?? '', 1) &&
    hasMinDoses(row[ESUS_COL.VACINA_PNEUMO] ?? '', 3)

  return { A: criteriaA, B: criteriaB, C: criteriaC, D: criteriaD, E: criteriaE }
}
