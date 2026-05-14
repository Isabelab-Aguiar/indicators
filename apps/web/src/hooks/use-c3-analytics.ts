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
import { C3_MAX_POINTS } from '@repo/types'
import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'

const EXAM_DONE = (v: string) => v === 'negative' || v === 'positive'

export const C3_CRITERIA_DEF: { id: C3CriterionId; points: number; label: string }[] = [
  { id: 'A', points: 10, label: '1ª consulta até 12ª semana' },
  { id: 'B', points: 9, label: '≥ 7 consultas pré-natal' },
  { id: 'C', points: 9, label: '≥ 7 aferições de PA' },
  { id: 'D', points: 9, label: '≥ 7 registros de peso e altura' },
  { id: 'E', points: 9, label: '≥ 3 visitas domiciliares' },
  { id: 'F', points: 9, label: 'Vacina dTpa registrada' },
  { id: 'G', points: 9, label: 'Exames 1º trimestre (HIV, Síf, HepB, HepC)' },
  { id: 'H', points: 9, label: 'Exames 3º trimestre (HIV, Sífilis)' },
  { id: 'I', points: 9, label: '≥ 1 atendimento odontológico' },
]

function evaluateCriteria(w: PregnantWoman): C3CriterionId[] {
  const met: C3CriterionId[] = []
  if (w.consultationsUpTo12Weeks >= 1) met.push('A')
  if (w.prenatalConsultations >= 7) met.push('B')
  if (w.bloodPressureMeasurements >= 7) met.push('C')
  if (w.weightHeightMeasurements >= 7) met.push('D')
  if (w.homeVisits >= 3) met.push('E')
  if (w.dtpaRegistered) met.push('F')
  if (
    EXAM_DONE(w.hivExam1stTrimester) &&
    EXAM_DONE(w.syphilisExam1stTrimester) &&
    EXAM_DONE(w.hepatitisBExam1stTrimester) &&
    EXAM_DONE(w.hepatitisCExam1stTrimester)
  )
    met.push('G')
  if (EXAM_DONE(w.hivExam3rdTrimester) && EXAM_DONE(w.syphilisExam3rdTrimester)) met.push('H')
  if (w.dentalAppointments >= 1) met.push('I')
  return met
}

export function classifyScore(pct: number): C3Classification {
  if (pct >= 80) return 'otimo'
  if (pct >= 60) return 'bom'
  if (pct >= 40) return 'suficiente'
  return 'regular'
}

function buildPatientRow(w: PregnantWoman): C3PatientRow {
  const criteriaMet = evaluateCriteria(w)
  const score = criteriaMet.reduce(
    (sum, id) => sum + (C3_CRITERIA_DEF.find((c) => c.id === id)?.points ?? 0),
    0,
  )
  const pctScore = Math.round((score / C3_MAX_POINTS) * 1000) / 10
  return {
    id: w.id,
    name: w.name,
    cpf: w.cpf,
    microarea: w.microarea,
    prenatalConsultations: w.prenatalConsultations,
    consultationsUpTo12Weeks: w.consultationsUpTo12Weeks,
    bloodPressureMeasurements: w.bloodPressureMeasurements,
    weightHeightMeasurements: w.weightHeightMeasurements,
    homeVisits: w.homeVisits,
    dentalAppointments: w.dentalAppointments,
    dtpaRegistered: w.dtpaRegistered,
    hivExam1stTrimester: w.hivExam1stTrimester,
    syphilisExam1stTrimester: w.syphilisExam1stTrimester,
    hepatitisBExam1stTrimester: w.hepatitisBExam1stTrimester,
    hepatitisCExam1stTrimester: w.hepatitisCExam1stTrimester,
    hivExam3rdTrimester: w.hivExam3rdTrimester,
    syphilisExam3rdTrimester: w.syphilisExam3rdTrimester,
    criteriaMet,
    score,
    pctScore,
    classification: classifyScore(pctScore),
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

export interface C3Breakdown {
  total: number
  avgScore: number
  classification: C3Classification
  criteriaStats: C3CriterionStat[]
  patients: C3PatientRow[]
}

export function computeC3Breakdown(women: PregnantWoman[]): C3Breakdown {
  const patients = women.map(buildPatientRow)
  const total = patients.length
  const avgPct =
    total > 0 ? Math.round((patients.reduce((s, p) => s + p.pctScore, 0) / total) * 10) / 10 : 0
  return {
    total,
    avgScore: avgPct,
    classification: classifyScore(avgPct),
    criteriaStats: C3_CRITERIA_DEF.map((def) => buildCriteriaStat(patients, def)),
    patients,
  }
}

export function useC3Analytics() {
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  const query = useQuery({
    queryKey: queryKeys.c3.breakdown(esfId),
    queryFn: fetchAllWomen,
    enabled: !!esfId,
    staleTime: 1000 * 60 * 5,
  })

  const women = useMemo(() => query.data ?? [], [query.data])
  const breakdown = useMemo(() => computeC3Breakdown(women), [women])

  return { ...query, women, breakdown }
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
