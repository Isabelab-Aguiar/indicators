'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'
import type { PaginatedPregnantWomen, PregnantWoman, PregnantWomanFilters } from '@repo/types'
import type { PregnantWomanInput } from '@repo/validations'

export function usePregnantWomen(filters: PregnantWomanFilters = {}) {
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  return useQuery({
    queryKey: queryKeys.pregnantWomen.list(esfId, filters),
    queryFn: async () => {
      const response = await apiClient.get<{ data: PaginatedPregnantWomen }>('/pregnant-women', {
        params: filters,
      })
      return response.data.data
    },
    enabled: !!esfId,
  })
}

export function usePregnantWoman(id: string) {
  return useQuery({
    queryKey: queryKeys.pregnantWomen.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<{ data: PregnantWoman }>(`/pregnant-women/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreatePregnantWoman() {
  const queryClient = useQueryClient()
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  return useMutation({
    mutationFn: (data: PregnantWomanInput) =>
      apiClient.post<{ data: PregnantWoman }>('/pregnant-women', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.pregnantWomen.all(esfId) })
      toast({ title: 'Gestante cadastrada com sucesso' })
    },
    onError: () => toast({ title: 'Erro ao cadastrar gestante', variant: 'destructive' }),
  })
}

export function useUpdatePregnantWoman(id: string) {
  const queryClient = useQueryClient()
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  return useMutation({
    mutationFn: (data: Partial<PregnantWomanInput>) =>
      apiClient.patch<{ data: PregnantWoman }>(`/pregnant-women/${id}`, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.pregnantWomen.detail(id) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.pregnantWomen.all(esfId) })
      toast({ title: 'Dados atualizados com sucesso' })
    },
    onError: () => toast({ title: 'Erro ao atualizar dados', variant: 'destructive' }),
  })
}

export function useDeleteAllPregnantWomen() {
  const queryClient = useQueryClient()
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  return useMutation({
    mutationFn: () => apiClient.delete('/pregnant-women'),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.pregnantWomen.all(esfId) })
      toast({ title: 'Dados removidos com sucesso' })
    },
    onError: () => toast({ title: 'Erro ao remover dados', variant: 'destructive' }),
  })
}
