'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { C1Gauge } from '@/components/indicators/c1-gauge'
import { C1BandsLegend } from '@/components/indicators/c1-bands-legend'
import type { C1AnalyticsData } from '../types/c1.types'

interface C1GaugeSectionProps {
  analytics: C1AnalyticsData | undefined
  isLoading: boolean
}

export function C1GaugeSection({ analytics, isLoading }: C1GaugeSectionProps) {
  const percentual = analytics?.tendencia.atual ?? 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Percentual C1 Atual</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {isLoading ? (
          <div className="bg-muted h-44 w-full animate-pulse rounded-xl" />
        ) : (
          <C1Gauge percent={percentual} />
        )}
        <div className="w-full">
          <p className="text-muted-foreground mb-3 text-[11px] font-semibold uppercase tracking-wide">
            Faixas de classificação
          </p>
          <C1BandsLegend percent={percentual} />
        </div>
      </CardContent>
    </Card>
  )
}
