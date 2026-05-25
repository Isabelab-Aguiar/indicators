'use client'

import { cn } from '@repo/ui'
import type { C1Execucao } from '../types/c1.types'
import {
  C1_ALERTA_LABELS,
  C1_CLASSIFICACAO_BADGE,
  C1_CLASSIFICACAO_LABELS,
} from '../constants/c1.constants'

interface C1ExecucaoCardProps {
  row: C1Execucao
}

export function C1ExecucaoCard({ row }: C1ExecucaoCardProps) {
  return (
    <div className="space-y-2 py-3">
      <div className="flex items-center justify-between">
        <span className="text-foreground font-mono text-sm font-semibold">{row.periodo}</span>
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-semibold',
            C1_CLASSIFICACAO_BADGE[row.classificacao],
          )}
        >
          {C1_CLASSIFICACAO_LABELS[row.classificacao]}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-muted-foreground">C1 (%)</p>
          <p className="text-foreground font-bold tabular-nums">
            {Number(row.percentual).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Programada</p>
          <p className="tabular-nums">{row.programada.toLocaleString('pt-BR')}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Espontânea</p>
          <p className="tabular-nums">{row.espontanea.toLocaleString('pt-BR')}</p>
        </div>
      </div>
      {row.alerta && <p className="text-destructive text-[11px]">{C1_ALERTA_LABELS[row.alerta]}</p>}
    </div>
  )
}
