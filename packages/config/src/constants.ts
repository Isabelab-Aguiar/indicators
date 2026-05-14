export const APP_NAME = 'Indicadores APS'
export const APP_DESCRIPTION = 'Sistema de Gestão de Gestantes e Indicadores da Atenção Básica'

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

export const TOKEN_EXPIRY = {
  ACCESS_TOKEN_SECONDS: 15 * 60,
  REFRESH_TOKEN_DAYS: 7,
  INVITE_TOKEN_HOURS: 48,
  PASSWORD_RESET_HOURS: 2,
} as const

export const RATE_LIMIT = {
  AUTH_WINDOW_MS: 15 * 60 * 1000,
  AUTH_MAX_REQUESTS: 10,
  GLOBAL_WINDOW_MS: 60 * 1000,
  GLOBAL_MAX_REQUESTS: 100,
} as const

export const UPLOAD = {
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_MIME_TYPES: [
    'text/csv',
    'text/plain',
    'application/vnd.ms-excel', // .csv no Windows
    'application/octet-stream', // .csv em alguns navegadores/SO
    'application/pdf',
  ],
} as const

export const QUEUE_NAMES = {
  IMPORT: 'import',
  NOTIFICATIONS: 'notifications',
  AUDIT: 'audit',
} as const

export const CACHE_TTL = {
  DASHBOARD: 300,
  PREGNANT_WOMEN_LIST: 60,
  USER_PERMISSIONS: 600,
} as const

export const BLOOD_PRESSURE_THRESHOLDS = {
  ELEVATED: { systolic: 120, diastolic: 80 },
  HIGH: { systolic: 130, diastolic: 80 },
  CRITICAL: { systolic: 140, diastolic: 90 },
} as const

export const PRENATAL_TARGETS = {
  MIN_CONSULTATIONS: 6,
  FIRST_CONSULTATION_WEEKS: 12,
  BLOOD_PRESSURE_MEASUREMENTS: 6,
  WEIGHT_MEASUREMENTS: 6,
} as const
