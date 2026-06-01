'use client'

import Link from 'next/link'
import { ChevronRight, Download, RefreshCw } from 'lucide-react'
import { Badge, Button } from '@repo/ui'
import { useAuthStore } from '@/store/auth.store'
import { useQueryClient } from '@tanstack/react-query'
import type { IndicatorCode } from '@/lib/indicators-aps'
import { INDICATORS } from '@/lib/indicators-aps'
import { IndicatorToolbar } from './indicator-toolbar'

interface IndicatorPageHeaderProps {
  code: IndicatorCode
  showToolbar?: boolean
  exportSlot?: React.ReactNode
  onRefresh?: () => void
  onExport?: () => void
  exportPending?: boolean
}

export function IndicatorPageHeader({
  code,
  showToolbar = false,
  exportSlot,
  onRefresh,
  onExport,
  exportPending = false,
}: IndicatorPageHeaderProps) {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const indicator = INDICATORS[code]

  function handleRefresh() {
    if (onRefresh) {
      onRefresh()
    } else {
      void queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === code })
    }
  }

  return (
    <>
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
          <span className="text-foreground font-medium">{indicator.shortLabel}</span>
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-md font-mono text-xs">
                {indicator.shortLabel}
              </Badge>
              {user?.esfName && (
                <Badge variant="outline" className="rounded-md text-xs">
                  {user.esfName}
                </Badge>
              )}
            </div>
            <h1 className="text-foreground mt-2 text-lg font-semibold">
              {indicator.shortLabel} {indicator.title}
            </h1>
            <p className="text-muted-foreground mt-0.5 text-xs">{indicator.description}</p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleRefresh}>
              <RefreshCw className="h-3.5 w-3.5" />
              Atualizar
            </Button>
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                loading={exportPending}
                onClick={onExport}
              >
                <Download className="h-3.5 w-3.5" />
                Exportar CSV
              </Button>
            )}
          </div>
        </div>
      </div>

      {showToolbar && <IndicatorToolbar exportSlot={exportSlot} />}
    </>
  )
}
