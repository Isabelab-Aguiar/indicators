import { C7_CRITERION_POINTS } from './c7.constants'
import { ESUS_COL } from './c7-csv.helpers'
import type { C7CriterionId, C7CriteriaResult, C7EligibilityResult } from '@repo/types'

export const classify = (pct: number): string =>
  pct >= 80 ? 'otimo' : pct >= 60 ? 'bom' : pct >= 40 ? 'suficiente' : 'regular'

export function computeScore(
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

export function parseDate(value: string): Date | null {
  const clean = value?.trim()
  if (!clean || clean === '-') return null
  const br = clean.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (br) return new Date(`${br[3]}-${br[2]}-${br[1]}`)
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return new Date(clean)
  return null
}

export function calcAge(birthDate: Date): number {
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  return m < 0 || (m === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age
}

export function monthsBetween(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
}

function latestDate(row: Record<string, string>, ...cols: string[]): Date | null {
  let best: Date | null = null
  for (const col of cols) {
    const d = parseDate(row[col] ?? '')
    if (d && (!best || d > best)) best = d
  }
  return best
}

function hasHpvDose(raw: string): boolean {
  const clean = raw?.trim()
  if (!clean || clean === '-') return false
  return /D\d\s*-/.test(clean)
}

export function deriveEsusCriteria(row: Record<string, string>): C7CriteriaResult {
  const now = new Date()

  const dataCitologia = latestDate(
    row,
    ESUS_COL.CITOLOGIA_DATA_AVALIACAO,
    ESUS_COL.CITOLOGIA_DATA_SOLICITACAO,
  )
  const criteriaA = dataCitologia !== null && monthsBetween(dataCitologia, now) <= 36

  const criteriaB = hasHpvDose(row[ESUS_COL.HPV] ?? '')

  const dataSaudeSexual = parseDate(row[ESUS_COL.SAUDE_SEXUAL] ?? '')
  const criteriaC = dataSaudeSexual !== null && monthsBetween(dataSaudeSexual, now) <= 12

  const dataMamografia = latestDate(
    row,
    ESUS_COL.MAMOGRAFIA_DATA_REALIZACAO,
    ESUS_COL.MAMOGRAFIA_DATA_AVALIACAO,
    ESUS_COL.MAMOGRAFIA_DATA_SOLICITACAO,
  )
  const criteriaD = dataMamografia !== null && monthsBetween(dataMamografia, now) <= 24

  return { A: criteriaA, B: criteriaB, C: criteriaC, D: criteriaD }
}
