'use client'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Clock, Loader2, Trash2, XCircle } from 'lucide-react'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { apiClient } from '@/lib/api-client'
import { toast } from '@/hooks/use-toast'
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
  const queryClient = useQueryClient()
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

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

  const remove = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/imports/${id}`),
    onSuccess: () => {
      setConfirmingId(null)
      void queryClient.invalidateQueries({ queryKey: queryKeys.imports.all(esfId) })
      toast({ title: 'Importação removida' })
    },
    onError: () => toast({ title: 'Erro ao remover importação', variant: 'destructive' }),
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
            {data.map((item) => (
              <ImportRow
                key={item.id}
                item={item}
                confirming={confirmingId === item.id}
                pending={remove.isPending && confirmingId === item.id}
                onAskConfirm={() => setConfirmingId(item.id)}
                onCancel={() => setConfirmingId(null)}
                onConfirm={() => remove.mutate(item.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ImportRowProps {
  item: Import
  confirming: boolean
  pending: boolean
  onAskConfirm: () => void
  onCancel: () => void
  onConfirm: () => void
}

function ImportRow({
  item,
  confirming,
  pending,
  onAskConfirm,
  onCancel,
  onConfirm,
}: ImportRowProps) {
  const config = STATUS_CONFIG[item.status]
  const Icon = config.icon
  return (
    <div className="border-border hover:bg-muted/20 group rounded-lg border p-3 transition-colors">
      <div className="flex items-center justify-between">
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
        <div className="flex items-center gap-2">
          <Badge variant={config.badge as 'secondary'} className="capitalize">
            {item.status}
          </Badge>
          <AnimatePresence mode="wait" initial={false}>
            {confirming ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="flex items-center gap-1"
              >
                <Button size="sm" variant="ghost" onClick={onCancel} disabled={pending}>
                  Cancelar
                </Button>
                <Button size="sm" variant="destructive" onClick={onConfirm} loading={pending}>
                  Remover
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="trash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Remover importação"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                  onClick={onAskConfirm}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {item.errorMessage && (
        <pre className="text-destructive bg-destructive/5 ml-7 mt-2 whitespace-pre-wrap rounded-md px-3 py-2 font-mono text-xs">
          {item.errorMessage}
        </pre>
      )}
    </div>
  )
}
