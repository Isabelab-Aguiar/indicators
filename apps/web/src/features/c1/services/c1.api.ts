import { apiClient } from '@/lib/api-client'
import type {
  C1AnalyticsData,
  C1Execucao,
  C1Importacao,
  C1ImportarResponse,
} from '../types/c1.types'

export const c1Api = {
  execucoes: (params?: Record<string, string>): Promise<{ data: C1Execucao[] }> => {
    const qs = params ? new URLSearchParams(params).toString() : ''
    return apiClient.get(`/c1/execucoes${qs ? `?${qs}` : ''}`).then((r) => r.data)
  },

  analytics: (): Promise<{ data: C1AnalyticsData }> =>
    apiClient.get('/c1/analytics').then((r) => r.data),

  importacaoStatus: (id: string): Promise<{ data: C1Importacao }> =>
    apiClient.get(`/c1/importacoes/${id}`).then((r) => r.data),

  importar: (file: File): Promise<{ data: C1ImportarResponse }> => {
    const form = new FormData()
    form.append('file', file)
    const endpoint = file.type === 'application/pdf' ? '/c1/importar-pdf' : '/c1/importar-csv'
    return apiClient
      .post(endpoint, form, { headers: { 'Content-Type': undefined } })
      .then((r) => r.data)
  },

  exportarCsv: (): Promise<Blob> =>
    apiClient.get('/c1/exportar-csv', { responseType: 'blob' }).then((r) => r.data as Blob),
}
