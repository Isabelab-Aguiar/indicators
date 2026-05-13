export type UserRole = 'admin' | 'manager' | 'nurse' | 'doctor' | 'acs'

export type UserStatus = 'active' | 'inactive' | 'pending_first_access'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  team: string | null
  avatarUrl: string | null
  esfId: string
  esfName: string
  esfCode: string
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  userId: string
  expiresAt: string
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthUser extends User {
  permissions: Permission[]
}

export type Permission =
  | 'gestantes:read'
  | 'gestantes:write'
  | 'gestantes:delete'
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'dashboard:read'
  | 'imports:read'
  | 'imports:write'
  | 'settings:read'
  | 'settings:write'
  | 'audit:read'

export interface InviteToken {
  id: string
  email: string
  role: UserRole
  token: string
  expiresAt: string
  usedAt: string | null
  createdBy: string
  createdAt: string
}
