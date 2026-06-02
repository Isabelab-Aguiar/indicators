'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { AdminStats, AdminUser, AdminEsf } from '@repo/types'
import type { AccessRequest, AccessRequestStatus } from '@repo/types'

interface AdminUsersFilters {
  esfId?: string
  role?: string
  status?: string
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: AdminStats }>('/admin/stats')
      return res.data.data
    },
  })
}

export function useAdminEsfs() {
  return useQuery<AdminEsf[]>({
    queryKey: ['admin', 'esfs'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: AdminEsf[] }>('/admin/esfs')
      return res.data.data
    },
  })
}

export function useAdminUsers(filters: AdminUsersFilters = {}) {
  return useQuery<AdminUser[]>({
    queryKey: ['admin', 'users', filters],
    queryFn: async () => {
      const res = await apiClient.get<{ data: AdminUser[] }>('/admin/users', { params: filters })
      return res.data.data
    },
  })
}

export function useAccessRequests(status?: AccessRequestStatus) {
  return useQuery<AccessRequest[]>({
    queryKey: ['admin', 'access-requests', status],
    queryFn: async () => {
      const res = await apiClient.get<{ data: AccessRequest[] }>('/admin/access-requests', {
        params: status ? { status } : undefined,
      })
      return res.data.data
    },
  })
}

export function useApproveRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/admin/access-requests/${id}/approve`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'access-requests'] }),
  })
}

export function useRejectRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/admin/access-requests/${id}/reject`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'access-requests'] }),
  })
}

export function useDeactivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.patch(`/users/${id}/deactivate`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}
