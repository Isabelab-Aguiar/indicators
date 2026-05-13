import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/auth.store'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  })

  client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        throw error
      }

      try {
        const refreshResponse = await axios.post<{ data: { accessToken: string } }>(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        )

        const { accessToken } = refreshResponse.data.data
        useAuthStore.getState().setAccessToken(accessToken)

        const originalRequest = error.config as AxiosRequestConfig
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        return client.request(originalRequest)
      } catch {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
        throw error
      }
    },
  )

  return client
}

export const apiClient = createApiClient()
