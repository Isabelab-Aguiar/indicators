'use client'

import { ChevronRight, Download, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Badge, Button } from '@repo/ui'
import { useAuthStore } from '@/store/auth.store'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { useC1ExportarCsv } from '../hooks/useC1ExportarCsv'

export function C1Header() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const esfId = user?.esfId ?? ''
  const exportarCsv = useC1ExportarCsv()

  function handleRefresh() {
    void queryClient.invalidateQueries({ queryKey: queryKeys.c1.all(esfId) })
  }

  return (
    <div className="border-border bg-background border-b px-4 py-4 sm:px-6">
      <nav className="text-muted-foreground mb-2 flex items-center gap-1 text-xs">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Início
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/indicadores" className="hover:text-foreground transition-colors">
          Indicadores
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">C1</span>
      </nav>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-md font-mono text-xs">
              C1
            </Badge>
            {user?.esfName && (
              <Badge variant="outline" className="rounded-md text-xs">
                {user.esfName}
              </Badge>
            )}
          </div>
          <h1 className="text-foreground text-lg font-semibold">C1 Mais Acesso à APS</h1>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Avalia o equilíbrio entre demanda programada e demanda espontânea da equipe APS.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleRefresh}>
            <RefreshCw className="h-3.5 w-3.5" />
            Atualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            loading={exportarCsv.isPending}
            onClick={() => exportarCsv.mutate()}
          >
            <Download className="h-3.5 w-3.5" />
            Exportar CSV
          </Button>
        </div>
      </div>
    </div>
  )
}
