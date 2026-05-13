export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  statusCode: number
  message: string
  error: string
  timestamp: string
  path: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface HealthCheck {
  status: 'ok' | 'error'
  timestamp: string
  services: {
    database: 'ok' | 'error'
    redis: 'ok' | 'error'
    queue: 'ok' | 'error'
  }
}
