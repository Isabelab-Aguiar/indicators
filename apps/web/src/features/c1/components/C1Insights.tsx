'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { cn } from '@repo/ui'
import type { C1AnalyticsData } from '../types/c1.types'
import type { C1InsightType } from '../constants/c1.constants'

interface C1InsightsProps {
  analytics: C1AnalyticsData | undefined
  isLoading: boolean
}

const INSIGHT_BORDER: Record<C1InsightType, string> = {
  danger: 'border-red-400 dark:border-red-500',
  success: 'border-emerald-400 dark:border-emerald-500',
  info: 'border-indigo-400 dark:border-indigo-500',
  default: 'border-border',
}

const INSIGHT_LABEL: Record<C1InsightType, string> = {
  danger: 'Alerta',
  success: 'Positivo',
  info: 'Tendência',
  default: 'Informação',
}

const INSIGHT_LABEL_COLOR: Record<C1InsightType, string> = {
  danger: 'text-red-500',
  success: 'text-emerald-600 dark:text-emerald-400',
  info: 'text-indigo-600 dark:text-indigo-400',
  default: 'text-muted-foreground',
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
        <CardTitle className="text-sm font-semibold">Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-muted h-10 animate-pulse rounded-lg" />
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
            return (
              <div key={i} className={cn('border-l-2 py-1 pl-3', INSIGHT_BORDER[type])}>
                <p
                  className={cn(
                    'text-[10px] font-semibold uppercase tracking-wide',
                    INSIGHT_LABEL_COLOR[type],
                  )}
                >
                  {INSIGHT_LABEL[type]}
                </p>
                <p className="text-foreground mt-0.5 text-sm leading-relaxed">{insight}</p>
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}
