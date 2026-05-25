'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { cn } from '@repo/ui'
import type { C1AnalyticsData } from '../types/c1.types'
import {
  C1DistribuicaoChart,
  C1EvolucaoChart,
  C1ProgramadaChart,
  C1EspontaneaChart,
} from './C1Charts'

const TABS = ['Distribuição', 'Evolução', 'Programada', 'Espontânea'] as const
type Tab = (typeof TABS)[number]

interface C1AnalyticsProps {
  analytics: C1AnalyticsData | undefined
  isLoading: boolean
}

export function C1Analytics({ analytics, isLoading }: C1AnalyticsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Distribuição')

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Análise Detalhada</CardTitle>
        <div className="flex flex-wrap gap-1 pt-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                activeTab === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="bg-muted h-64 animate-pulse rounded-xl" />}
        {!isLoading && analytics && (
          <>
            {activeTab === 'Distribuição' && <C1DistribuicaoChart analytics={analytics} />}
            {activeTab === 'Evolução' && <C1EvolucaoChart analytics={analytics} />}
            {activeTab === 'Programada' && <C1ProgramadaChart analytics={analytics} />}
            {activeTab === 'Espontânea' && <C1EspontaneaChart analytics={analytics} />}
          </>
        )}
      </CardContent>
    </Card>
  )
}
