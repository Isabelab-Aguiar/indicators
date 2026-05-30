'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type {
  C7WomanRecord,
  C7PatientRow,
  C7CriterionId,
  C7CriterionStat,
  C7Classification,
  C7CriteriaResult,
} from '@repo/types'
import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'
import { checkEligibility, getMaxPoints, calcAge } from '@/lib/c7-eligibility'

export const C7_CRITERIA_DEF: {
  id: C7CriterionId
  points: number
  label: string
  ageRange: string
}[] = [
  { id: 'A', points: 20, label: 'Rastreio colo do útero (36m)', ageRange: '25–64 anos' },
  { id: 'B', points: 30, label: 'Vacina HPV ≥1 dose', ageRange: '9–14 anos' },
  { id: 'C', points: 30, label: 'Saúde sexual e reprodutiva (12m)', ageRange: '14–69 anos' },
  { id: 'D', points: 20, label: 'Rastreio mamografia (24m)', ageRange: '50–69 anos' },
]

function evaluateCriteria(w: C7WomanRecord): C7CriteriaResult {
  return {
    A: w.cytologyLast36m,
    B: w.hpvVaccineDose1,
    C: w.sexualHealthLast12m,
    D: w.mammographyLast24m,
  }
}

export function classifyScore(pct: number): C7Classification {
  if (pct >= 80) return 'otimo'
  if (pct >= 60) return 'bom'
  if (pct >= 40) return 'suficiente'
  return 'regular'
}

function buildPatientRow(w: C7WomanRecord): C7PatientRow {
  const age = calcAge(w.birthDate)
  const eligibility = checkEligibility(age)
  const criteria = evaluateCriteria(w)
  const scoreMax = getMaxPoints(eligibility)

  const score = C7_CRITERIA_DEF.reduce(
    (sum, def) => (criteria[def.id] && eligibility[def.id] ? sum + def.points : sum),
    0,
  )

  const pctScore = scoreMax > 0 ? Math.round((score / scoreMax) * 1000) / 10 : 0

  const pendingCriteria = C7_CRITERIA_DEF.filter(
    (def) => eligibility[def.id] && !criteria[def.id],
  ).map((def) => def.id)

  return {
    id: w.id,
    name: w.nome,
    age,
    microarea: w.microarea,
    acs: w.acs,
    criteria,
    eligibility,
    score,
    scoreMax,
    pctScore,
    classification: classifyScore(pctScore),
    pendingCriteria,
  }
}

function buildCriterionStat(
  patients: C7PatientRow[],
  def: (typeof C7_CRITERIA_DEF)[number],
): C7CriterionStat {
  const eligible = patients.filter((p) => p.eligibility[def.id])
  const achieved = eligible.filter((p) => p.criteria[def.id])
  const notAchieved = eligible.length - achieved.length

  return {
    id: def.id,
    label: def.label,
    ageRange: def.ageRange,
    achieved: achieved.length,
    notAchieved,
    total: patients.length,
    eligible: eligible.length,
    pctAchieved:
      eligible.length > 0 ? Math.round((achieved.length / eligible.length) * 1000) / 10 : 0,
    pctNotAchieved:
      eligible.length > 0 ? Math.round((notAchieved / eligible.length) * 1000) / 10 : 0,
  }
}

async function fetchAllWomen(): Promise<C7WomanRecord[]> {
  const res = await apiClient.get<{ data: C7WomanRecord[] }>('/c7/patients')
  return res.data.data ?? []
}

export interface C7Breakdown {
  total: number
  avgScore: number
  classification: C7Classification
  criteriaStats: C7CriterionStat[]
  patients: C7PatientRow[]
}

export function computeC7Breakdown(women: C7WomanRecord[]): C7Breakdown {
  const patients = women.map(buildPatientRow)
  const total = patients.length
  const avgPct =
    total > 0 ? Math.round((patients.reduce((s, p) => s + p.pctScore, 0) / total) * 10) / 10 : 0
  return {
    total,
    avgScore: avgPct,
    classification: classifyScore(avgPct),
    criteriaStats: C7_CRITERIA_DEF.map((def) => buildCriterionStat(patients, def)),
    patients,
  }
}

export function useC7Analytics() {
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  const query = useQuery({
    queryKey: queryKeys.c7.breakdown(esfId),
    queryFn: fetchAllWomen,
    enabled: !!esfId,
    staleTime: 1000 * 60 * 5,
  })

  const women = useMemo(() => query.data ?? [], [query.data])
  const breakdown = useMemo(() => computeC7Breakdown(women), [women])

  return { ...query, women, breakdown }
}

export function filterByC7Criterion(
  patients: C7PatientRow[],
  id: C7CriterionId,
  achieved: boolean,
): C7PatientRow[] {
  return patients.filter((p) => p.eligibility[id] && (achieved ? p.criteria[id] : !p.criteria[id]))
}
