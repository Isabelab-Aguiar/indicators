'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { C2Breakdown, C2Classification, C2CriterionStat, C2PatientRow } from '@repo/types'
import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'

export const C2_CRITERIA_DEF: { id: string; points: number; label: string }[] = [
  { id: 'A', points: 20, label: '1ª consulta até o 30º dia de vida' },
  { id: 'B', points: 20, label: 'Pelo menos 9 consultas até os 2 anos' },
  { id: 'C', points: 20, label: 'Pelo menos 9 registros de peso e altura' },
  { id: 'D', points: 20, label: '2 visitas domiciliares ACS/TACS' },
  { id: 'E', points: 20, label: 'Vacinas DTP, HepB, Hib, polio, SCR e pneumocócica' },
]

export function classifyScore(score: number): C2Classification {
  if (score >= 80) return 'otimo'
  if (score >= 60) return 'bom'
  if (score >= 40) return 'suficiente'
  return 'regular'
}

const EMPTY_BREAKDOWN: C2Breakdown = {
  total: 0,
  avgScore: 0,
  classification: 'regular',
  criteriaStats: [],
  patients: [],
}

async function fetchBreakdown(_esfId: string, periodo?: string): Promise<C2Breakdown> {
  const params = periodo ? `?periodo=${periodo}` : ''
  const res = await apiClient.get<{ data: C2Breakdown }>(`/c2/breakdown${params}`)
  return res.data.data ?? EMPTY_BREAKDOWN
}

export function buildBreakdownFromPatients(patients: C2PatientRow[]): C2Breakdown {
  const total = patients.length
  const avgScore =
    total > 0 ? Math.round((patients.reduce((s, p) => s + p.score, 0) / total) * 10) / 10 : 0
  const criteriaStats: C2CriterionStat[] = C2_CRITERIA_DEF.map((def) => {
    const achieved = patients.filter((p) => p.criteria[def.id as keyof typeof p.criteria]).length
    return {
      id: def.id as C2CriterionStat['id'],
      label: def.label,
      achieved,
      notAchieved: total - achieved,
      total,
      pctAchieved: total > 0 ? Math.round((achieved / total) * 1000) / 10 : 0,
      pctNotAchieved: total > 0 ? Math.round(((total - achieved) / total) * 1000) / 10 : 0,
    }
  })
  return { total, avgScore, classification: classifyScore(avgScore), criteriaStats, patients }
}

export function useC2Analytics(periodo?: string) {
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')
  const query = useQuery({
    queryKey: [...queryKeys.c2.breakdown(esfId), periodo],
    queryFn: () => fetchBreakdown(esfId, periodo),
    enabled: !!esfId,
    staleTime: 1000 * 60 * 5,
  })
  const breakdown = useMemo(() => query.data ?? EMPTY_BREAKDOWN, [query.data])
  return { ...query, breakdown }
}
