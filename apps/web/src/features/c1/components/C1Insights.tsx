'use client'

import { AlertTriangle, CheckCircle, Info, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { cn } from '@repo/ui'
import type { C1AnalyticsData } from '../types/c1.types'
import type { C1InsightType } from '../constants/c1.constants'

interface C1InsightsProps {
  analytics: C1AnalyticsData | undefined
  isLoading: boolean
}

const INSIGHT_ICON: Record<C1InsightType, React.ElementType> = {
  danger: AlertTriangle,
  success: CheckCircle,
  info: TrendingUp,
  default: Info,
}

const INSIGHT_ACCENT: Record<C1InsightType, string> = {
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  default: 'bg-muted text-muted-foreground',
}

const INSIGHT_LABEL: Record<C1InsightType, string> = {
  danger: 'Alerta',
  success: 'Positivo',
  info: 'Tendência',
  default: 'Informação',
}

function resolveInsightType(text: string): C1InsightType {
  if (text.includes('baixa abertura') || text.includes('Urgências')) return 'danger'
  if (text.includes('Bom equilíbrio')) return 'success'
  if (text.includes('C1')) return 'info'
  return 'default'
}

export function C1Insights({ analytics, isLoading }: C1InsightsProps) {
  const insights = analytics?.insights ?? []

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Insights Automáticos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-muted h-14 animate-pulse rounded-lg" />
            ))}
          </div>
        )}
        {!isLoading && insights.length === 0 && (
          <p className="text-muted-foreground py-4 text-center text-sm">
            Importe PDFs para gerar insights automáticos.
          </p>
        )}
        {!isLoading &&
          insights.map((insight, i) => {
            const type = resolveInsightType(insight)
            const Icon = INSIGHT_ICON[type]
            return (
              <div key={i} className="border-border flex items-start gap-3 rounded-xl border p-3">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
                    INSIGHT_ACCENT[type],
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
                    {INSIGHT_LABEL[type]}
                  </p>
                  <p className="text-foreground mt-0.5 text-sm leading-relaxed">{insight}</p>
                </div>
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}
