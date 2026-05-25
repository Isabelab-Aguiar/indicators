'use client'

import { CheckCircle, Clock, Loader2, XCircle } from 'lucide-react'
import { cn } from '@repo/ui'
import { useC1JobStatus } from '../hooks/useC1JobStatus'
import type { C1ImportacaoStatus } from '../types/c1.types'

interface C1StatusPollProps {
  importacaoId: string
  fileName: string
}

const STATUS_CONFIG: Record<
  C1ImportacaoStatus,
  { icon: React.ElementType; label: string; accent: string; spin?: boolean }
> = {
  pendente: {
    icon: Clock,
    label: 'Na fila...',
    accent: 'text-muted-foreground',
  },
  processando: {
    icon: Loader2,
    label: 'Processando...',
    accent: 'text-blue-600 dark:text-blue-400',
    spin: true,
  },
  concluido: {
    icon: CheckCircle,
    label: 'Concluído',
    accent: 'text-green-600 dark:text-green-400',
  },
  erro: {
    icon: XCircle,
    label: 'Erro',
    accent: 'text-destructive',
  },
}

export function C1StatusPoll({ importacaoId, fileName }: C1StatusPollProps) {
  const { data } = useC1JobStatus(importacaoId)

  const status = data?.status ?? 'pendente'
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <div className="border-border flex items-center gap-3 rounded-lg border px-3 py-2">
      <Icon className={cn('h-4 w-4 shrink-0', config.accent, config.spin && 'animate-spin')} />
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-medium">{fileName}</p>
        <p className={cn('text-xs', config.accent)}>{config.label}</p>
        {status === 'erro' && data?.erroDetalhes && (
          <p className="text-destructive mt-0.5 text-[11px]">{data.erroDetalhes}</p>
        )}
      </div>
    </div>
  )
}
