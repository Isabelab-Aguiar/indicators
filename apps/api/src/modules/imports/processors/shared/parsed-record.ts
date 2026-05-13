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
  prenatalConsultations?: number
  consultationsUpTo12Weeks?: number
  bloodPressureMeasurements?: number
  weightHeightMeasurements?: number
  homeVisits?: number
  dentalAppointments?: number
}
