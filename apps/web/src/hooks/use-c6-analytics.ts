'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type {
  C6ElderlyRecord,
  C6PatientRow,
  C6CriterionId,
  C6CriterionStat,
  C6Classification,
  C6CriteriaResult,
} from '@repo/types'
import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'

export const C6_CRITERIA_DEF: { id: C6CriterionId; points: number; label: string }[] = [
  { id: 'A', points: 25, label: '≥ 1 consulta em 12 meses' },
  { id: 'B', points: 25, label: 'Peso e altura em 12 meses' },
  { id: 'C', points: 25, label: '≥ 2 visitas do ACS (intervalo ≥ 30d)' },
  { id: 'D', points: 25, label: 'Vacina Influenza em 12 meses' },
]

function calcAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  return m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age
}

function evaluateCriteria(r: C6ElderlyRecord): C6CriteriaResult {
  return {
    A: r.consultationsLast12m >= 1,
    B: r.weightHeightLast12m,
    C: r.acsVisitsLast12m >= 2 && r.acsVisitsIntervalDays >= 30,
    D: r.influenzaVaccineLast12m,
  }
}

export function classifyScore(score: number): C6Classification {
  if (score >= 80) return 'otimo'
  if (score >= 60) return 'bom'
  if (score >= 40) return 'suficiente'
  return 'regular'
}

function buildPatientRow(r: C6ElderlyRecord): C6PatientRow {
  const criteria = evaluateCriteria(r)
  const score = C6_CRITERIA_DEF.reduce((sum, def) => (criteria[def.id] ? sum + def.points : sum), 0)
  const age = r.birthDate ? calcAge(r.birthDate) : null
  const pendingCriteria = C6_CRITERIA_DEF.filter((def) => !criteria[def.id]).map((def) => def.id)

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
  patients: C6PatientRow[],
  def: (typeof C6_CRITERIA_DEF)[number],
): C6CriterionStat {
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

async function fetchAllElders(): Promise<C6ElderlyRecord[]> {
  const res = await apiClient.get<{ data: C6ElderlyRecord[] }>('/c6/patients')
  return res.data.data ?? []
}

export interface C6Breakdown {
  total: number
  avgScore: number
  classification: C6Classification
  criteriaStats: C6CriterionStat[]
  patients: C6PatientRow[]
}

export function computeC6Breakdown(elders: C6ElderlyRecord[]): C6Breakdown {
  const patients = elders.map(buildPatientRow)
  const total = patients.length
  const avgScore =
    total > 0 ? Math.round((patients.reduce((s, p) => s + p.score, 0) / total) * 10) / 10 : 0

  return {
    total,
    avgScore,
    classification: classifyScore(avgScore),
    criteriaStats: C6_CRITERIA_DEF.map((def) => buildCriterionStat(patients, def)),
    patients,
  }
}

export function useC6Analytics() {
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  const query = useQuery({
    queryKey: queryKeys.c6.breakdown(esfId),
    queryFn: fetchAllElders,
    enabled: !!esfId,
    staleTime: 1000 * 60 * 5,
  })

  const elders = useMemo(() => query.data ?? [], [query.data])
  const breakdown = useMemo(() => computeC6Breakdown(elders), [elders])

  return { ...query, elders, breakdown }
}

export function filterByC6Criterion(
  patients: C6PatientRow[],
  id: C6CriterionId,
  achieved: boolean,
): C6PatientRow[] {
  return patients.filter((p) => (achieved ? p.criteria[id] : !p.criteria[id]))
}
