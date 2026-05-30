'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type {
  C5HypertensiveRecord,
  C5PatientRow,
  C5CriterionId,
  C5CriterionStat,
  C5Classification,
  C5CriteriaResult,
} from '@repo/types'
import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'

export const C5_CRITERIA_DEF: { id: C5CriterionId; points: number; label: string }[] = [
  { id: 'A', points: 25, label: '≥ 1 consulta nos últimos 6 meses' },
  { id: 'B', points: 25, label: '≥ 1 aferição de PA nos últimos 6 meses' },
  { id: 'C', points: 25, label: 'Peso e altura registrados em 12 meses' },
  { id: 'D', points: 25, label: '≥ 2 visitas do ACS (intervalo ≥ 30d)' },
]

function calcAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  return m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age
}

function evaluateCriteria(r: C5HypertensiveRecord): C5CriteriaResult {
  return {
    A: r.consultationsLast6m >= 1,
    B: r.bloodPressureLast6m >= 1,
    C: r.weightHeightLast12m,
    D: r.acsVisitsLast12m >= 2 && r.acsVisitsIntervalDays >= 30,
  }
}

export function classifyScore(score: number): C5Classification {
  if (score >= 80) return 'otimo'
  if (score >= 60) return 'bom'
  if (score >= 40) return 'suficiente'
  return 'regular'
}

function buildPatientRow(r: C5HypertensiveRecord): C5PatientRow {
  const criteria = evaluateCriteria(r)
  const score = C5_CRITERIA_DEF.reduce((sum, def) => (criteria[def.id] ? sum + def.points : sum), 0)
  const age = r.birthDate ? calcAge(r.birthDate) : null
  const pendingCriteria = C5_CRITERIA_DEF.filter((def) => !criteria[def.id]).map((def) => def.id)

  return {
    id: r.id,
    name: r.nome,
    birthDate: r.birthDate,
    age,
    microarea: r.microarea,
    acs: r.acs,
    criteria,
    score,
    classification: classifyScore(score),
    pendingCriteria,
  }
}

function buildCriterionStat(
  patients: C5PatientRow[],
  def: (typeof C5_CRITERIA_DEF)[number],
): C5CriterionStat {
  const total = patients.length
  const achieved = patients.filter((p) => p.criteria[def.id]).length
  const notAchieved = total - achieved

  return {
    id: def.id,
    label: def.label,
    achieved,
    notAchieved,
    total,
    pctAchieved: total > 0 ? Math.round((achieved / total) * 1000) / 10 : 0,
    pctNotAchieved: total > 0 ? Math.round((notAchieved / total) * 1000) / 10 : 0,
  }
}

async function fetchAllHypertensive(): Promise<C5HypertensiveRecord[]> {
  const res = await apiClient.get<{ data: C5HypertensiveRecord[] }>('/c5/patients')
  return res.data.data ?? []
}

export interface C5Breakdown {
  total: number
  avgScore: number
  classification: C5Classification
  criteriaStats: C5CriterionStat[]
  patients: C5PatientRow[]
}

export function computeC5Breakdown(records: C5HypertensiveRecord[]): C5Breakdown {
  const patients = records.map(buildPatientRow)
  const total = patients.length
  const avgScore =
    total > 0 ? Math.round((patients.reduce((s, p) => s + p.score, 0) / total) * 10) / 10 : 0

  return {
    total,
    avgScore,
    classification: classifyScore(avgScore),
    criteriaStats: C5_CRITERIA_DEF.map((def) => buildCriterionStat(patients, def)),
    patients,
  }
}

export function useC5Analytics() {
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  const query = useQuery({
    queryKey: queryKeys.c5.breakdown(esfId),
    queryFn: fetchAllHypertensive,
    enabled: !!esfId,
    staleTime: 1000 * 60 * 5,
  })

  const records = useMemo(() => query.data ?? [], [query.data])
  const breakdown = useMemo(() => computeC5Breakdown(records), [records])

  return { ...query, records, breakdown }
}

export function filterByC5Criterion(
  patients: C5PatientRow[],
  id: C5CriterionId,
  achieved: boolean,
): C5PatientRow[] {
  return patients.filter((p) => (achieved ? p.criteria[id] : !p.criteria[id]))
}
