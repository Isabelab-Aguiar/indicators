import type { UserRole } from '@repo/types'

export interface AdminStats {
  totalEsfs: number
  totalUsers: number
  activeUsers: number
  pendingRequests: number
  usersByRole: Record<UserRole, number>
  usersByEsf: { esfId: string; esfName: string; esfCode: string; count: number }[]
  recentActivity: { userId: string; action: string; createdAt: Date }[]
}
