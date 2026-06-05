'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Esf } from '@repo/types'

export interface CreateAccessRequestInput {
  name: string
  email: string
  cpf: string
  role: string
  esfId: string
  message?: string
}

export function usePublicEsfs() {
  return useQuery<Esf[]>({
    queryKey: ['esfs', 'public'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Esf[] }>('/esf/public')
      return res.data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateAccessRequest() {
  return useMutation({
    mutationFn: (data: CreateAccessRequestInput) =>
      apiClient.post('/access-requests', {
        ...data,
        cpf: data.cpf.replace(/\D/g, ''),
      }),
  })
}
