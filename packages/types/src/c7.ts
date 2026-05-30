export type C7CriterionId = 'A' | 'B' | 'C' | 'D'

export type C7Classification = 'otimo' | 'bom' | 'suficiente' | 'regular'

export const C7_MAX_POINTS = 100

export interface C7CriteriaResult {
  A: boolean
  B: boolean
  C: boolean
  D: boolean
}

export interface C7EligibilityResult {
  A: boolean
  B: boolean
  C: boolean
  D: boolean
}

export interface C7WomanRecord {
  id: string
  nome: string
  birthDate: string
  microarea: string
  acs: string
  periodo: string
  cytologyLast36m: boolean
  hpvVaccineDose1: boolean
  sexualHealthLast12m: boolean
  mammographyLast24m: boolean
}

export interface C7CriterionStat {
  id: C7CriterionId
  label: string
  ageRange: string
  achieved: number
  notAchieved: number
  total: number
  eligible: number
  pctAchieved: number
  pctNotAchieved: number
}

export interface C7PatientRow {
  id: string
  name: string
  age: number
  microarea: string
  acs: string
  criteria: C7CriteriaResult
  eligibility: C7EligibilityResult
  score: number
  scoreMax: number
  pctScore: number
  classification: C7Classification
  pendingCriteria: C7CriterionId[]
}
