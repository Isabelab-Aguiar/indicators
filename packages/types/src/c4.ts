export type C4CriterionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export type C4Classification = 'otimo' | 'bom' | 'suficiente' | 'regular'

export const C4_MAX_POINTS = 100

export type C4CriteriaResult = Record<C4CriterionId, boolean>

export interface C4CriterionStat {
  id: C4CriterionId
  label: string
  achieved: number
  notAchieved: number
  total: number
  pctAchieved: number
  pctNotAchieved: number
}

export interface C4PatientRow {
  id: string
  name: string
  microarea: string
  acs: string
  criteria: C4CriteriaResult
  score: number
  classification: C4Classification
  pendingCriteria: C4CriterionId[]
}

export interface C4Breakdown {
  total: number
  avgScore: number
  classification: C4Classification
  criteriaStats: C4CriterionStat[]
  patients: C4PatientRow[]
}

export interface C4DiabeticRecord {
  id: string
  nome: string
  microarea: string
  acs: string
  periodo: string
  consultationsLast6m: number
  bloodPressureLast6m: number
  weightHeightLast12m: boolean
  acsVisitsLast12m: number
  acsVisitsIntervalDays: number
  hba1cLast12m: boolean
  feetEvaluationLast12m: boolean
}
