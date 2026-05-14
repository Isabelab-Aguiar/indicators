export type C3CriterionId = 'A' | 'B' | 'C' | 'D'

export type C3Classification = 'otimo' | 'bom' | 'suficiente' | 'regular'

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
  prenatalConsultations: number
  consultationsUpTo12Weeks: number
  homeVisits: number
  dentalAppointments: number
  dtpaRegistered: boolean
  hivExam1stTrimester: string
  syphilisExam1stTrimester: string
  hepatitisBExam1stTrimester: string
  hepatitisCExam1stTrimester: string
  criteriaMet: C3CriterionId[]
  score: number
  classification: C3Classification
}
