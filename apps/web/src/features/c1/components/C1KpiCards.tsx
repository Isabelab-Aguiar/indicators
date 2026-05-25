'use client'

import { Activity, AlertTriangle, BarChart3, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent } from '@repo/ui'
import { cn } from '@repo/ui'
import type { C1AnalyticsData } from '../types/c1.types'
import {
  C1_ALERTA_LABELS,
  C1_CLASSIFICACAO_BADGE,
  C1_CLASSIFICACAO_LABELS,
  C1_KPI_ACCENTS,
} from '../constants/c1.constants'
import { classificarC1 } from '../services/c1-calculator'
import { C1KpiCard } from './C1KpiCard'

interface C1KpiCardsProps {
  analytics: C1AnalyticsData | undefined
  isLoading: boolean
}

function SkeletonCards() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="bg-muted h-16 animate-pulse rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function C1KpiCards({ analytics, isLoading }: C1KpiCardsProps) {
  if (isLoading) return <SkeletonCards />

  const atual = analytics?.tendencia.atual
  const variacao = analytics?.tendencia.variacao
  const alertaAtivo = atual !== null && atual !== undefined && (atual > 70 || atual <= 10)
  const classificacao = atual !== null && atual !== undefined ? classificarC1(atual) : null

  const programada = analytics?.distribuicao.programada ?? 0
  const espontanea = analytics?.distribuicao.espontanea ?? 0
  const total = programada + espontanea
  const variacaoPositiva = variacao !== null && variacao !== undefined && variacao >= 0

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <C1KpiCard
        label="Percentual C1"
        value={atual !== null && atual !== undefined ? `${atual.toFixed(1)}%` : '—'}
        sub="Período atual"
        icon={BarChart3}
      />
      <C1KpiCard label="Total atendimentos" value={total.toLocaleString('pt-BR')} icon={Users} />
      <C1KpiCard
        label="Demanda programada"
        value={programada.toLocaleString('pt-BR')}
        icon={Activity}
        accent={C1_KPI_ACCENTS.programada}
      />
      <C1KpiCard
        label="Demanda espontânea"
        value={espontanea.toLocaleString('pt-BR')}
        icon={Activity}
        accent={C1_KPI_ACCENTS.espontanea}
      />
      <Card>
        <CardContent className="p-4">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wide">
            Classificação
          </p>
          {classificacao ? (
            <span
              className={cn(
                'mt-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                C1_CLASSIFICACAO_BADGE[classificacao],
              )}
            >
              {C1_CLASSIFICACAO_LABELS[classificacao]}
            </span>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </CardContent>
      </Card>
      <C1KpiCard
        label="Tendência vs anterior"
        value={
          variacao !== null && variacao !== undefined
            ? `${variacaoPositiva ? '+' : ''}${variacao.toFixed(1)} pp`
            : '—'
        }
        icon={variacaoPositiva ? TrendingUp : TrendingDown}
        accent={variacaoPositiva ? C1_KPI_ACCENTS.positivo : C1_KPI_ACCENTS.negativo}
      />
      <C1KpiCard
        label="Equilíbrio"
        value={
          total > 0
            ? `${Math.round((programada / total) * 10) / 10}:${Math.round((espontanea / total) * 10) / 10}`
            : '—'
        }
        sub="Prog:Espon"
        icon={BarChart3}
      />
      <Card>
        <CardContent className="flex items-start gap-3 p-4">
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
              alertaAtivo ? C1_KPI_ACCENTS.alerta : C1_KPI_ACCENTS.sem_alerta,
            )}
          >
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wide">
              Alerta de risco
            </p>
            <p className="text-foreground mt-0.5 text-xs font-medium">
              {alertaAtivo && atual !== null && atual !== undefined
                ? C1_ALERTA_LABELS[atual > 70 ? 'acima_70' : 'abaixo_10']
                : 'Sem alertas ativos'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
