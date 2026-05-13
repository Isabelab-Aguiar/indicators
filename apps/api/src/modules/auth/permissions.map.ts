import type { Permission, UserRole } from '@repo/types'

const ALL_PERMISSIONS: Permission[] = [
  'gestantes:read',
  'gestantes:write',
  'gestantes:delete',
  'users:read',
  'users:write',
  'users:delete',
  'dashboard:read',
  'imports:read',
  'imports:write',
  'settings:read',
  'settings:write',
  'audit:read',
]

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ALL_PERMISSIONS,
  manager: [
    'gestantes:read',
    'gestantes:write',
    'users:read',
    'users:write',
    'dashboard:read',
    'imports:read',
    'imports:write',
    'settings:read',
    'audit:read',
  ],
  nurse: ['gestantes:read', 'gestantes:write', 'dashboard:read', 'imports:read', 'imports:write'],
  doctor: ['gestantes:read', 'gestantes:write', 'dashboard:read', 'imports:read'],
  acs: ['gestantes:read', 'dashboard:read'],
}

export function permissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}
