export type ImportType = 'csv' | 'pdf'

export type ImportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'partial'

export interface Import {
  id: string
  type: ImportType
  fileName: string
  storageKey: string | null
  totalRecords: number
  processedRecords: number
  failedRecords: number
  status: ImportStatus
  errorMessage: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface ImportProgress {
  importId: string
  status: ImportStatus
  processedRecords: number
  failedRecords: number
  totalRecords: number
  percentage: number
}

export interface CsvPreviewRow {
  rowNumber: number
  data: Record<string, string>
  isValid: boolean
  errors: string[]
}

export interface CsvPreview {
  headers: string[]
  rows: CsvPreviewRow[]
  totalRows: number
  validRows: number
  invalidRows: number
}
