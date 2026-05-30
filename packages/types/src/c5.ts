export type C5CriterionId = 'A' | 'B' | 'C' | 'D'

export type C5Classification = 'otimo' | 'bom' | 'suficiente' | 'regular'

export const C5_MAX_POINTS = 100

export interface C5CriteriaResult {
  A: boolean
  B: boolean
  C: boolean
  D: boolean
}

export interface C5HypertensiveRecord {
  id: string
  nome: string
  birthDate: string | null
  microarea: string
  acs: string
  periodo: string
  consultationsLast6m: number
  bloodPressureLast6m: number
  weightHeightLast12m: boolean
  acsVisitsLast12m: number
  acsVisitsIntervalDays: number
}

export interface C5CriterionStat {
  id: C5CriterionId
  label: string
  achieved: number
  notAchieved: number
  total: number
  pctAchieved: number
  pctNotAchieved: number
}

export interface C5PatientRow {
  id: string
  name: string
  birthDate: string | null
  age: number | null
  microarea: string
  acs: string
  criteria: C5CriteriaResult
  score: number
  classification: C5Classification
  pendingCriteria: C5CriterionId[]
}

export interface C5ImportError {
  row: number
  field: string
  message: string
}

export interface C5ImportResult {
  imported: number
  updated: number
  errors: C5ImportError[]
  warnings: { row: number; message: string }[]
}
