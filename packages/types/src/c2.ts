export type C2CriterionId = 'A' | 'B' | 'C' | 'D' | 'E'
export type C2Classification = 'otimo' | 'bom' | 'suficiente' | 'regular'

export const C2_MAX_POINTS = 100

export type C2CriteriaResult = Record<C2CriterionId, boolean>

export interface C2CriterionStat {
  id: C2CriterionId
  label: string
  achieved: number
  notAchieved: number
  total: number
  pctAchieved: number
  pctNotAchieved: number
}

export interface C2PatientRow {
  id: string
  name: string
  microarea: string
  acs: string
  birthDate: string | null
  ageInDays: number | null
  criteria: C2CriteriaResult
  notApplicableCriteria: C2CriterionId[]
  score: number
  classification: C2Classification
  pendingCriteria: C2CriterionId[]
}

export interface C2Breakdown {
  total: number
  avgScore: number
  classification: C2Classification
  criteriaStats: C2CriterionStat[]
  patients: C2PatientRow[]
}

export interface C2ImportError {
  row: number
  field: string
  message: string
}

export interface C2ImportResult {
  imported: number
  updated: number
  errors: C2ImportError[]
}
