'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'
import { c1Api } from '../services/c1.api'
import { C1_POLL_INTERVAL_MS } from '../constants/c1.constants'

export function useC1JobStatus(importacaoId: string | null) {
  const queryClient = useQueryClient()
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  return useQuery({
    queryKey: queryKeys.c1.importacao(importacaoId ?? ''),
    queryFn: async () => {
      const res = await c1Api.importacaoStatus(importacaoId!)
      return res.data
    },
    enabled: !!importacaoId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'processando' || status === 'pendente') return C1_POLL_INTERVAL_MS
      if (status === 'concluido')
        void queryClient.invalidateQueries({ queryKey: queryKeys.c1.all(esfId) })
      return false
    },
  })
}
