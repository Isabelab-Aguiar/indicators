'use client'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'
import type { DashboardKpi, MicroareaStats } from '@repo/types'
import { CACHE_TTL } from '@repo/config'

export function useDashboardMetrics() {
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  return useQuery({
    queryKey: queryKeys.dashboard.metrics(esfId),
    queryFn: async () => {
      const response = await apiClient.get<{ data: DashboardKpi }>('/dashboard/metrics')
      return response.data.data
    },
    enabled: !!esfId,
    staleTime: CACHE_TTL.DASHBOARD * 1000,
  })
}

export function useMicroareaStats() {
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  return useQuery({
    queryKey: queryKeys.dashboard.microareaStats(esfId),
    queryFn: async () => {
      const response = await apiClient.get<{ data: MicroareaStats[] }>('/dashboard/microarea-stats')
      return response.data.data
    },
    enabled: !!esfId,
    staleTime: CACHE_TTL.DASHBOARD * 1000,
  })
}
