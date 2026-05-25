'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'
import { c1Api } from '../services/c1.api'

export function useC1Analytics() {
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  return useQuery({
    queryKey: queryKeys.c1.analytics(esfId),
    queryFn: async () => {
      const res = await c1Api.analytics()
      return res.data
    },
    enabled: !!esfId,
  })
}
