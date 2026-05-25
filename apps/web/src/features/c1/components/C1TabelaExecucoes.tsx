'use client'

import { useState } from 'react'
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { cn } from '@repo/ui'
import type { C1Execucao } from '../types/c1.types'
import {
  C1_ALERTA_LABELS,
  C1_CLASSIFICACAO_BADGE,
  C1_CLASSIFICACAO_LABELS,
  C1_PAGE_SIZE,
} from '../constants/c1.constants'
import { C1ExecucaoCard } from './C1ExecucaoCard'

interface C1TabelaExecucoesProps {
  execucoes: C1Execucao[] | undefined
  isLoading: boolean
}

type SortKey = 'periodo' | 'percentual' | 'total' | 'classificacao'
type SortDir = 'asc' | 'desc'

const TABLE_COLS = [
  { key: 'periodo', label: 'Período' },
  { key: 'programada', label: 'Programadas' },
  { key: 'espontanea', label: 'Espontâneas' },
  { key: 'total', label: 'Total' },
  { key: 'percentual', label: 'C1 (%)' },
  { key: 'classificacao', label: 'Classificação' },
  { key: 'alerta', label: 'Alerta' },
] as const

export function C1TabelaExecucoes({ execucoes, isLoading }: C1TabelaExecucoesProps) {
  const [sortKey, setSortKey] = useState<SortKey>('periodo')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(0)

  const rows = execucoes ?? []

  const sorted = [...rows].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'percentual') cmp = Number(a.percentual) - Number(b.percentual)
    else if (sortKey === 'total') cmp = a.total - b.total
    else if (sortKey === 'periodo') cmp = a.periodo.localeCompare(b.periodo)
    else if (sortKey === 'classificacao') cmp = a.classificacao.localeCompare(b.classificacao)
    return sortDir === 'asc' ? cmp : -cmp
  })

  const totalPages = Math.ceil(sorted.length / C1_PAGE_SIZE)
  const paginated = sorted.slice(page * C1_PAGE_SIZE, page * C1_PAGE_SIZE + C1_PAGE_SIZE)

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ArrowUpDown className="h-3 w-3 opacity-40" />
    return sortDir === 'asc' ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Histórico de Execuções ({rows.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading && <div className="bg-muted mx-4 mb-4 h-48 animate-pulse rounded-xl" />}
        {!isLoading && rows.length === 0 && (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Nenhuma execução encontrada. Importe um PDF para começar.
          </p>
        )}
        {!isLoading && rows.length > 0 && (
          <>
            <div className="hidden sm:block">
              <table className="w-full text-xs">
                <thead className="border-border border-b">
                  <tr>
                    {TABLE_COLS.map(({ key, label }) => (
                      <th
                        key={key}
                        className="text-muted-foreground cursor-pointer px-4 py-3 text-left font-medium"
                        onClick={() => toggleSort(key as SortKey)}
                      >
                        <span className="flex items-center gap-1">
                          {label}
                          <SortIcon k={key as SortKey} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((row) => (
                    <tr
                      key={row.id}
                      className="border-border hover:bg-muted/30 border-b transition-colors"
                    >
                      <td className="text-foreground px-4 py-3 font-mono font-medium">
                        {row.periodo}
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {row.programada.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {row.espontanea.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {row.total.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 font-bold tabular-nums">
                        {Number(row.percentual).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                            C1_CLASSIFICACAO_BADGE[row.classificacao],
                          )}
                        >
                          {C1_CLASSIFICACAO_LABELS[row.classificacao]}
                        </span>
                      </td>
                      <td className="max-w-[180px] px-4 py-3">
                        {row.alerta ? (
                          <span className="text-destructive text-[11px]">
                            {C1_ALERTA_LABELS[row.alerta]}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-border divide-y px-4 pb-2 sm:hidden">
              {paginated.map((row) => (
                <C1ExecucaoCard key={row.id} row={row} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="text-muted-foreground flex items-center justify-between px-4 py-3 text-xs">
                <span>
                  Página {page + 1} de {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="hover:bg-muted rounded px-2 py-1 transition-colors disabled:opacity-40"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="hover:bg-muted rounded px-2 py-1 transition-colors disabled:opacity-40"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
