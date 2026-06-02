import type { UserRole } from './auth'
import type { Esf } from './esf'

export type AccessRequestStatus = 'pending' | 'approved' | 'rejected'

export interface AccessRequest {
  id: string
  name: string
  email: string
  cpf: string
  role: UserRole
  esfId: string
  status: AccessRequestStatus
  message: string | null
  reviewedBy: string | null
  reviewedAt: string | null
  createdAt: string
  esf: Pick<Esf, 'id' | 'name' | 'code'>
  reviewer: { id: string; name: string } | null
}
