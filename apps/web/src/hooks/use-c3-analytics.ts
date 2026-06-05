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

const EXAM_DONE = (v: string) => v === 'negative' || v === 'positive'

export const C3_CRITERIA_DEF: {
  id: C3CriterionId
  points: number
  label: string
  minWeeks: number
}[] = [
  { id: 'A', points: 10, label: '1ª consulta até 12ª semana', minWeeks: 12 },
  { id: 'B', points: 9, label: '≥ 7 consultas pré-natal', minWeeks: 32 },
  { id: 'C', points: 9, label: '≥ 7 aferições de PA', minWeeks: 32 },
  { id: 'D', points: 9, label: '≥ 7 registros de peso e altura', minWeeks: 32 },
  { id: 'E', points: 9, label: '≥ 3 visitas domiciliares', minWeeks: 16 },
  { id: 'F', points: 9, label: 'Vacina dTpa registrada', minWeeks: 27 },
  { id: 'G', points: 9, label: 'Exames 1º trimestre (HIV, Síf, HepB, HepC)', minWeeks: 12 },
  { id: 'H', points: 9, label: 'Exames 3º trimestre (HIV, Sífilis)', minWeeks: 28 },
  { id: 'I', points: 9, label: '≥ 1 atendimento odontológico', minWeeks: 16 },
]

function evaluateCriteria(
  w: PregnantWoman,
  weeks: number | null,
): { met: C3CriterionId[]; notApplicable: C3CriterionId[] } {
  const met: C3CriterionId[] = []
  const notApplicable: C3CriterionId[] = []

  function check(id: C3CriterionId, achieved: boolean) {
    const def = C3_CRITERIA_DEF.find((c) => c.id === id)!
    if (weeks !== null && weeks < def.minWeeks) {
      notApplicable.push(id)
    } else if (achieved) {
      met.push(id)
    }
  }

  check('A', w.consultationsUpTo12Weeks >= 1)
  check('B', w.prenatalConsultations >= 7)
  check('C', w.bloodPressureMeasurements >= 7)
  check('D', w.weightHeightMeasurements >= 7)
  check('E', w.homeVisits >= 3)
  check('F', w.dtpaRegistered)
  check(
    'G',
    EXAM_DONE(w.hivExam1stTrimester) &&
      EXAM_DONE(w.syphilisExam1stTrimester) &&
      EXAM_DONE(w.hepatitisBExam1stTrimester) &&
      EXAM_DONE(w.hepatitisCExam1stTrimester),
  )
  check('H', EXAM_DONE(w.hivExam3rdTrimester) && EXAM_DONE(w.syphilisExam3rdTrimester))
  check('I', w.dentalAppointments >= 1)

  return { met, notApplicable }
}

export function classifyScore(pct: number): C3Classification {
  if (pct >= 80) return 'otimo'
  if (pct >= 60) return 'bom'
  if (pct >= 40) return 'suficiente'
  return 'regular'
}

function buildPatientRow(w: PregnantWoman): C3PatientRow {
  const weeks = w.gestationalAgeWeeks
  const { met, notApplicable } = evaluateCriteria(w, weeks)

  const score = met.reduce(
    (sum, id) => sum + (C3_CRITERIA_DEF.find((c) => c.id === id)?.points ?? 0),
    0,
  )
  const scoreMax = C3_CRITERIA_DEF.filter((c) => !notApplicable.includes(c.id)).reduce(
    (sum, c) => sum + c.points,
    0,
  )
  const pctScore = scoreMax > 0 ? Math.round((score / scoreMax) * 1000) / 10 : 0

  return {
    id: w.id,
    name: w.name,
    cpf: w.cpf,
    microarea: w.microarea,
    gestationalAgeWeeks: weeks,
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
    criteriaMet: met,
    criteriaNotApplicable: notApplicable,
    score,
    scoreMax,
    pctScore,
    classification: classifyScore(pctScore),
  }
}

function buildCriteriaStat(
  patients: C3PatientRow[],
  def: (typeof C3_CRITERIA_DEF)[number],
): C3CriterionStat {
  const applicable = patients.filter((p) => !p.criteriaNotApplicable.includes(def.id))
  const total = applicable.length
  const achieved = applicable.filter((p) => p.criteriaMet.includes(def.id)).length
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
  if (achieved) return patients.filter((p) => p.criteriaMet.includes(id))
  return patients.filter(
    (p) => !p.criteriaMet.includes(id) && !p.criteriaNotApplicable.includes(id),
  )
}
