'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type {
  C4DiabeticRecord,
  C4PatientRow,
  C4CriterionId,
  C4CriterionStat,
  C4Classification,
  C4CriteriaResult,
} from '@repo/types'
import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'

export const C4_CRITERIA_DEF: { id: C4CriterionId; points: number; label: string }[] = [
  { id: 'A', points: 20, label: '≥ 1 consulta nos últimos 6 meses' },
  { id: 'B', points: 15, label: '≥ 1 aferição de PA nos últimos 6 meses' },
  { id: 'C', points: 15, label: 'Peso e altura registrados em 12 meses' },
  { id: 'D', points: 20, label: '≥ 2 visitas do ACS (intervalo ≥ 30d)' },
  { id: 'E', points: 15, label: 'Hemoglobina Glicada solicitada em 12 meses' },
  { id: 'F', points: 15, label: 'Avaliação dos pés realizada em 12 meses' },
]

function evaluateCriteria(r: C4DiabeticRecord): C4CriteriaResult {
  return {
    A: r.consultationsLast6m >= 1,
    B: r.bloodPressureLast6m >= 1,
    C: r.weightHeightLast12m,
    D: r.acsVisitsLast12m >= 2 && r.acsVisitsIntervalDays >= 30,
    E: r.hba1cLast12m,
    F: r.feetEvaluationLast12m,
  }
}

export function classifyScore(score: number): C4Classification {
  if (score >= 80) return 'otimo'
  if (score >= 60) return 'bom'
  if (score >= 40) return 'suficiente'
  return 'regular'
}

function buildPatientRow(r: C4DiabeticRecord): C4PatientRow {
  const criteria = evaluateCriteria(r)
  const score = C4_CRITERIA_DEF.reduce((sum, def) => (criteria[def.id] ? sum + def.points : sum), 0)
  return {
    id: r.id,
    name: r.nome,
    microarea: r.microarea,
    acs: r.acs,
    criteria,
    score,
    classification: classifyScore(score),
    pendingCriteria: C4_CRITERIA_DEF.filter((d) => !criteria[d.id]).map((d) => d.id),
  }
}

function buildCriterionStat(
  patients: C4PatientRow[],
  def: (typeof C4_CRITERIA_DEF)[number],
): C4CriterionStat {
  const total = patients.length
  const achieved = patients.filter((p) => p.criteria[def.id]).length
  return {
    id: def.id,
    label: def.label,
    achieved,
    notAchieved: total - achieved,
    total,
    pctAchieved: total > 0 ? Math.round((achieved / total) * 1000) / 10 : 0,
    pctNotAchieved: total > 0 ? Math.round(((total - achieved) / total) * 1000) / 10 : 0,
  }
}

export interface C4Breakdown {
  total: number
  avgScore: number
  classification: C4Classification
  criteriaStats: C4CriterionStat[]
  patients: C4PatientRow[]
}

export function computeC4Breakdown(records: C4DiabeticRecord[]): C4Breakdown {
  const patients = records.map(buildPatientRow)
  const total = patients.length
  const avgScore =
    total > 0 ? Math.round((patients.reduce((s, p) => s + p.score, 0) / total) * 10) / 10 : 0
  return {
    total,
    avgScore,
    classification: classifyScore(avgScore),
    criteriaStats: C4_CRITERIA_DEF.map((def) => buildCriterionStat(patients, def)),
    patients,
  }
}

async function fetchAllDiabetics(): Promise<C4DiabeticRecord[]> {
  const res = await apiClient.get<{ data: C4DiabeticRecord[] }>('/c4/patients')
  return res.data.data ?? []
}

export function useC4Analytics() {
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')
  const query = useQuery({
    queryKey: queryKeys.c4.breakdown(esfId),
    queryFn: fetchAllDiabetics,
    enabled: !!esfId,
    staleTime: 1000 * 60 * 5,
  })
  const records = useMemo(() => query.data ?? [], [query.data])
  const breakdown = useMemo(() => computeC4Breakdown(records), [records])
  return { ...query, records, breakdown }
}
