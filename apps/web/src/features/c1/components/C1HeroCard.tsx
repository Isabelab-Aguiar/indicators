'use client'

import { Card, CardContent } from '@repo/ui'
import { cn } from '@repo/ui'
import { C1Gauge } from '@/components/indicators/c1-gauge'
import type { C1Execucao } from '../types/c1.types'
import { C1_CLASSIFICACAO_BADGE, C1_CLASSIFICACAO_LABELS } from '../constants/c1.constants'
import { classificarC1 } from '../services/c1-calculator'

interface C1HeroCardProps {
  execucoes: C1Execucao[] | undefined
  isLoading: boolean
  periodo?: string
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-foreground text-base font-semibold tabular-nums">{value}</p>
    </div>
  )
}

export function C1HeroCard({ execucoes, isLoading, periodo }: C1HeroCardProps) {
  if (isLoading) {
    return <div className="bg-muted h-56 animate-pulse rounded-xl" />
  }

  const atual = execucoes?.[0]
  const anterior = execucoes?.[1]

  const percentual = atual ? Number(atual.percentual) : 0
  const variacao =
    atual && anterior
      ? Math.round((Number(atual.percentual) - Number(anterior.percentual)) * 100) / 100
      : null
  const programada = atual?.programada ?? 0
  const espontanea = atual?.espontanea ?? 0
  const total = programada + espontanea
  const classificacao = atual ? classificarC1(percentual) : null
  const variacaoPositiva = variacao != null && variacao >= 0
  const subtitulo = periodo ?? atual?.periodo ?? 'Período atual'

  return (
    <Card className="overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-indigo-400/50 to-transparent" />
      <CardContent className="p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
          <div className="space-y-5">
            <div className="space-y-1.5">
              {classificacao && (
                <span
                  className={cn(
                    'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                    C1_CLASSIFICACAO_BADGE[classificacao],
                  )}
                >
                  {C1_CLASSIFICACAO_LABELS[classificacao]}
                </span>
              )}
              <p className="text-foreground text-5xl font-bold tabular-nums tracking-tight">
                {atual ? `${percentual.toFixed(1)}%` : '—'}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Percentual C1 · {subtitulo}</span>
                {variacao != null && (
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      variacaoPositiva ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500',
                    )}
                  >
                    {variacaoPositiva ? '+' : ''}
                    {variacao.toFixed(1)} pp
                  </span>
                )}
              </div>
            </div>

            <div className="border-border grid grid-cols-3 gap-4 border-t pt-4">
              <StatItem label="Total" value={total > 0 ? total.toLocaleString('pt-BR') : '—'} />
              <StatItem
                label="Programada"
                value={programada > 0 ? programada.toLocaleString('pt-BR') : '—'}
              />
              <StatItem
                label="Espontânea"
                value={espontanea > 0 ? espontanea.toLocaleString('pt-BR') : '—'}
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <C1Gauge percent={percentual} hideValue />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
