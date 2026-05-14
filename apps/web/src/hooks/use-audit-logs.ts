'use client'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'
import type { AuditLog } from '@repo/types'

export function useAuditLogs() {
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')
  return useQuery({
    queryKey: queryKeys.audit.all(esfId),
    queryFn: async () => {
      const res = await apiClient.get<{ data: AuditLog[] }>('/audit-logs')
      return res.data.data
    },
    enabled: !!esfId,
    retry: 1,
  })
}
