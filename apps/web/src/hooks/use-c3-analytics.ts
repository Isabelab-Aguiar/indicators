'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type {
  PregnantWoman,
  C3PatientRow,
  C3CriterionId,
  C3CriterionStat,
  C3Classification,
} from '@repo/types'
import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'

export const C3_CRITERIA_DEF: { id: C3CriterionId; points: number; label: string }[] = [
  { id: 'A', points: 25, label: '≥ 6 consultas pré-natal' },
  { id: 'B', points: 25, label: 'Exames HIV / Sífilis / Hep.B' },
  { id: 'C', points: 25, label: 'Consulta odontológica' },
  { id: 'D', points: 25, label: 'Vacina dTpa registrada' },
]

function evaluateCriteria(w: PregnantWoman): C3CriterionId[] {
  const met: C3CriterionId[] = []
  if (w.prenatalConsultations >= 6) met.push('A')
  if (
    w.hivExam1stTrimester !== 'pending' &&
    w.hivExam1stTrimester !== 'not_performed' &&
    w.syphilisExam1stTrimester !== 'pending' &&
    w.syphilisExam1stTrimester !== 'not_performed' &&
    w.hepatitisBExam1stTrimester !== 'pending' &&
    w.hepatitisBExam1stTrimester !== 'not_performed'
  )
    met.push('B')
  if (w.dentalAppointments >= 1) met.push('C')
  if (w.dtpaRegistered) met.push('D')
  return met
}

export function classifyScore(score: number): C3Classification {
  if (score >= 80) return 'otimo'
  if (score >= 60) return 'bom'
  if (score >= 40) return 'suficiente'
  return 'regular'
}

function buildPatientRow(w: PregnantWoman): C3PatientRow {
  const criteriaMet = evaluateCriteria(w)
  const score = criteriaMet.reduce(
    (sum, id) => sum + (C3_CRITERIA_DEF.find((c) => c.id === id)?.points ?? 0),
    0,
  )
  return {
    id: w.id,
    name: w.name,
    cpf: w.cpf,
    microarea: w.microarea,
    prenatalConsultations: w.prenatalConsultations,
    consultationsUpTo12Weeks: w.consultationsUpTo12Weeks,
    homeVisits: w.homeVisits,
    dentalAppointments: w.dentalAppointments,
    dtpaRegistered: w.dtpaRegistered,
    hivExam1stTrimester: w.hivExam1stTrimester,
    syphilisExam1stTrimester: w.syphilisExam1stTrimester,
    hepatitisBExam1stTrimester: w.hepatitisBExam1stTrimester,
    hepatitisCExam1stTrimester: w.hepatitisCExam1stTrimester,
    criteriaMet,
    score,
    classification: classifyScore(score),
  }
}

function buildCriteriaStat(
  patients: C3PatientRow[],
  def: (typeof C3_CRITERIA_DEF)[number],
): C3CriterionStat {
  const total = patients.length
  const achieved = patients.filter((p) => p.criteriaMet.includes(def.id)).length
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

async function fetchAllWomen(): Promise<PregnantWoman[]> {
  const res = await apiClient.get<{ data: { data: PregnantWoman[] } }>('/pregnant-women', {
    params: { pageSize: 1000, page: 1 },
  })
  return res.data.data.data
}

export function useC3Analytics() {
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  const query = useQuery({
    queryKey: queryKeys.c3.breakdown(esfId),
    queryFn: fetchAllWomen,
    enabled: !!esfId,
    staleTime: 1000 * 60 * 5,
  })

  const breakdown = useMemo(() => {
    const patients = (query.data ?? []).map(buildPatientRow)
    const total = patients.length
    const avgScore =
      total > 0 ? Math.round((patients.reduce((s, p) => s + p.score, 0) / total) * 10) / 10 : 0
    return {
      total,
      avgScore,
      classification: classifyScore(avgScore),
      criteriaStats: C3_CRITERIA_DEF.map((def) => buildCriteriaStat(patients, def)),
      patients,
    }
  }, [query.data])

  return { ...query, breakdown }
}

export function filterByCriterion(
  patients: C3PatientRow[],
  id: C3CriterionId,
  achieved: boolean,
): C3PatientRow[] {
  return patients.filter((p) =>
    achieved ? p.criteriaMet.includes(id) : !p.criteriaMet.includes(id),
  )
}
