import type { UserRole, UserStatus } from './auth'

export interface AdminStats {
  totalEsfs: number
  totalUsers: number
  activeUsers: number
  pendingRequests: number
  usersByRole: Record<UserRole, number>
  usersByEsf: { esfId: string; esfName: string; esfCode: string; count: number }[]
  recentActivity: { userId: string; action: string; createdAt: string }[]
}

export interface AdminUser {
  id: string
  name: string
  email: string | null
  role: UserRole
  status: UserStatus
  esfId: string
  createdAt: string
}

export interface AdminEsf {
  id: string
  name: string
  code: string
  userCount: number
}
