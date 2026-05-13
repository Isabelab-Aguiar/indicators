export interface Esf {
  id: string
  name: string
  code: string
  createdAt: string
  updatedAt: string
}

export interface TenantContext {
  esfId: string
  esfName: string
  esfCode: string
  userId: string
  userRole: string
}
