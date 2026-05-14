export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'IMPORT'
  | 'EXPORT'
  | 'PASSWORD_RESET'
  | 'INVITE_SENT'

export type AuditEntity = 'pregnant_women' | 'users' | 'imports' | 'auth' | 'settings'

export interface AuditUser {
  id: string
  name: string
  email: string
  role: string
}

export interface AuditLog {
  id: string
  userId: string | null
  user: AuditUser | null
  action: AuditAction
  entity: AuditEntity
  entityId: string | null
  metadata: Record<string, unknown> | null
  ipAddress: string
  userAgent: string
  createdAt: string
}

export interface AuditLogFilters {
  userId?: string
  action?: AuditAction
  entity?: AuditEntity
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}
