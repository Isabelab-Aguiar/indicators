export type C6CriterionId = 'A' | 'B' | 'C' | 'D'

export type C6Classification = 'otimo' | 'bom' | 'suficiente' | 'regular'

export const C6_MAX_POINTS = 100

export interface C6CriteriaResult {
  A: boolean
  B: boolean
  C: boolean
  D: boolean
}

export interface C6ElderlyRecord {
  id: string
  nome: string
  birthDate: string | null
  microarea: string
  acs: string
  periodo: string
  consultationsLast12m: number
  weightHeightLast12m: boolean
  acsVisitsLast12m: number
  acsVisitsIntervalDays: number
  influenzaVaccineLast12m: boolean
}

export interface C6CriterionStat {
  id: C6CriterionId
  label: string
  achieved: number
  notAchieved: number
  total: number
  pctAchieved: number
  pctNotAchieved: number
}

export interface C6PatientRow {
  id: string
  name: string
  birthDate: string | null
  age: number | null
  microarea: string
  acs: string
  criteria: C6CriteriaResult
  score: number
  classification: C6Classification
  pendingCriteria: C6CriterionId[]
}

export interface C6ImportError {
  row: number
  field: string
  message: string
}

export interface C6ImportResult {
  imported: number
  updated: number
  errors: C6ImportError[]
  warnings: { row: number; message: string }[]
}
