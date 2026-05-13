'use client'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, Clock, Loader2, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@repo/ui'
import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'
import type { Import } from '@repo/types'

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-muted-foreground', badge: 'secondary' },
  processing: { icon: Loader2, color: 'text-blue-500', badge: 'info' },
  completed: { icon: CheckCircle, color: 'text-emerald-500', badge: 'success' },
  partial: { icon: CheckCircle, color: 'text-amber-500', badge: 'warning' },
  failed: { icon: XCircle, color: 'text-red-500', badge: 'destructive' },
} as const

export function ImportHistory() {
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.imports.all(esfId),
    queryFn: async () => {
      const res = await apiClient.get<{ data: Import[] }>('/imports')
      return res.data.data
    },
    enabled: !!esfId,
    retry: 1,
    refetchInterval: (query) => {
      if (query.state.status === 'error') return false

      const hasProcessing = query.state.data?.some(
        (i) => i.status === 'processing' || i.status === 'pending',
      )
      return hasProcessing ? 3000 : false
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Histórico de Importações</CardTitle>
        <CardDescription className="text-xs">
          Atualizações em tempo real enquanto processa
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-muted h-12 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : !data?.length ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Nenhuma importação realizada
          </p>
        ) : (
          <div className="space-y-2">
            {data.map((item) => {
              const config = STATUS_CONFIG[item.status]
              const Icon = config.icon
              return (
                <div
                  key={item.id}
                  className="border-border flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${config.color} ${item.status === 'processing' ? 'animate-spin' : ''}`}
                    />
                    <div>
                      <p className="text-foreground text-sm font-medium">{item.fileName}</p>
                      <p className="text-muted-foreground text-xs">
                        {item.processedRecords}/{item.totalRecords} registros ·{' '}
                        {new Date(item.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={config.badge as 'secondary'} className="capitalize">
                    {item.status}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
