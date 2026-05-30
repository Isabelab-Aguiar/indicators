'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'
import { c1Api } from '../services/c1.api'

export function useC1ImportarPdf() {
  const queryClient = useQueryClient()
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  return useMutation({
    mutationFn: (file: File) => c1Api.importarPdf(file).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.c1.all(esfId) })
    },
  })
}
