export type BloodPressureStatus = 'normal' | 'elevated' | 'high' | 'critical'
export type ExamResult = 'pending' | 'negative' | 'positive' | 'not_performed'
export type GestationalRisk = 'habitual' | 'alto_risco'

export interface PregnantWoman {
  id: string
  esfId: string
  name: string
  cpf: string
  birthDate: string
  address: string
  phone: string
  microarea: string
  weight: number | null
  height: number | null
  bloodPressure: string | null
  bloodPressureStatus: BloodPressureStatus | null
  lastMeasurementDate: string | null
  daysSinceDoctor: number | null
  daysSinceNursing: number | null
  daysSinceDentist: number | null
  daysSinceHomeVisit: number | null
  // Pré-natal
  gestationalRisk: GestationalRisk | null
  lmp: string | null
  gestationalAgeWeeks: number | null
  gestationalAgeDays: number | null
  expectedDeliveryDate: string | null
  gestationalAgeEcoWeeks: number | null
  gestationalAgeEcoDays: number | null
  expectedDeliveryDateEco: string | null
  lastPrenatalConsultation: string | null
  // Contadores
  prenatalConsultations: number
  consultationsUpTo12Weeks: number
  bloodPressureMeasurements: number
  weightHeightMeasurements: number
  homeVisits: number
  dentalAppointments: number
  dtpaRegistered: boolean
  // Exames
  hivExam1stTrimester: ExamResult
  syphilisExam1stTrimester: ExamResult
  hepatitisBExam1stTrimester: ExamResult
  hepatitisCExam1stTrimester: ExamResult
  hivExam3rdTrimester: ExamResult
  syphilisExam3rdTrimester: ExamResult
  observations: string | null
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface PregnantWomanSummary {
  id: string
  name: string
  cpf: string
  microarea: string
  bloodPressure: string | null
  bloodPressureStatus: BloodPressureStatus | null
  prenatalConsultations: number
  lastMeasurementDate: string | null
  updatedAt: string
}

export interface PregnantWomanFilters {
  search?: string
  microarea?: string
  bloodPressureStatus?: BloodPressureStatus
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedPregnantWomen {
  data: PregnantWomanSummary[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
