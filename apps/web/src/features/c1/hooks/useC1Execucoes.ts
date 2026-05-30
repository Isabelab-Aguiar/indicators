'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'
import { c1Api } from '../services/c1.api'

interface C1ExecucoesFilters {
  periodo?: string
  classificacao?: string
  alerta?: string
}

export function useC1Execucoes(filters?: C1ExecucoesFilters) {
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  return useQuery({
    queryKey: queryKeys.c1.execucoes(esfId, filters),
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (filters?.periodo) params.periodo = filters.periodo
      if (filters?.classificacao) params.classificacao = filters.classificacao
      if (filters?.alerta) params.alerta = filters.alerta
      const res = await c1Api.execucoes(params)
      return res.data
    },
    enabled: !!esfId,
  })
}
