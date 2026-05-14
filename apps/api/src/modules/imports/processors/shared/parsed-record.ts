export type CsvExamResult = 'pending' | 'negative' | 'positive' | 'not_performed'
export type CsvGestationalRisk = 'habitual' | 'alto_risco'

export interface ParsedRecord {
  name: string
  cpf: string
  birthDate: Date
  address: string
  phone: string
  microarea: string
  weight?: number
  height?: number
  bloodPressure?: string
  lastMeasurementDate?: Date
  daysSinceDoctor?: number
  daysSinceNursing?: number
  daysSinceDentist?: number
  daysSinceHomeVisit?: number
  // Pré-natal
  gestationalRisk?: CsvGestationalRisk
  lmp?: Date
  gestationalAgeWeeks?: number
  gestationalAgeDays?: number
  expectedDeliveryDate?: Date
  gestationalAgeEcoWeeks?: number
  gestationalAgeEcoDays?: number
  expectedDeliveryDateEco?: Date
  lastPrenatalConsultation?: Date
  // Contadores
  prenatalConsultations?: number
  consultationsUpTo12Weeks?: number
  bloodPressureMeasurements?: number
  weightHeightMeasurements?: number
  homeVisits?: number
  dentalAppointments?: number
  dtpaRegistered?: boolean
  // Exames
  hivExam1stTrimester?: CsvExamResult
  syphilisExam1stTrimester?: CsvExamResult
  hepatitisBExam1stTrimester?: CsvExamResult
  hepatitisCExam1stTrimester?: CsvExamResult
  hivExam3rdTrimester?: CsvExamResult
  syphilisExam3rdTrimester?: CsvExamResult
}
