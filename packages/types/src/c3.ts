export type C3CriterionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I'

export type C3Classification = 'otimo' | 'bom' | 'suficiente' | 'regular'

export const C3_MAX_POINTS = 82

export interface C3CriterionStat {
  id: C3CriterionId
  label: string
  achieved: number
  notAchieved: number
  total: number
  pctAchieved: number
  pctNotAchieved: number
}

export interface C3PatientRow {
  id: string
  name: string
  cpf: string
  microarea: string
  gestationalAgeWeeks: number | null
  prenatalConsultations: number
  consultationsUpTo12Weeks: number
  bloodPressureMeasurements: number
  weightHeightMeasurements: number
  homeVisits: number
  dentalAppointments: number
  dtpaRegistered: boolean
  hivExam1stTrimester: string
  syphilisExam1stTrimester: string
  hepatitisBExam1stTrimester: string
  hepatitisCExam1stTrimester: string
  hivExam3rdTrimester: string
  syphilisExam3rdTrimester: string
  criteriaMet: C3CriterionId[]
  criteriaNotApplicable: C3CriterionId[]
  score: number
  scoreMax: number
  pctScore: number
  classification: C3Classification
}
