export interface DashboardKpi {
  total: number
  withPrenatalUpToDate: number
  withHighBloodPressure: number
  withPendingExams: number
  visitedThisMonth: number
  consultationsThisMonth: number
}

export interface MicroareaStats {
  microarea: string
  total: number
  prenatalUpToDate: number
  highBloodPressure: number
}

export interface ExamCoverageStats {
  hivFirstTrimester: number
  syphilisFirstTrimester: number
  hepatitisBFirstTrimester: number
  hepatitisCFirstTrimester: number
  hivThirdTrimester: number
  syphilisThirdTrimester: number
  total: number
}

export interface TimeSeriesPoint {
  date: string
  value: number
}

export interface DashboardData {
  kpis: DashboardKpi
  microareaStats: MicroareaStats[]
  examCoverage: ExamCoverageStats
  consultationsTrend: TimeSeriesPoint[]
  visitsTrend: TimeSeriesPoint[]
}
