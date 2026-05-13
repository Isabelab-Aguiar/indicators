'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth.store'
import { queryKeys } from '@/lib/query-keys'
import type { AuthUser } from '@repo/types'
import type { LoginInput } from '@repo/validations'

interface LoginResponse {
  accessToken: string
  expiresIn: number
}

export function useLogin() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await apiClient.post<{ data: LoginResponse }>('/auth/login', data)
      return response.data.data
    },
    onSuccess: async (tokens) => {
      const meResponse = await apiClient.get<{ data: AuthUser }>('/auth/me', {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      })
      setAuth(meResponse.data.data, tokens.accessToken)
      router.push('/dashboard')
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  return useMutation({
    mutationFn: () => apiClient.post('/auth/logout'),
    onSettled: () => {
      clearAuth()
      router.push('/login')
    },
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const response = await apiClient.get<{ data: AuthUser }>('/auth/me')
      return response.data.data
    },
  })
}
