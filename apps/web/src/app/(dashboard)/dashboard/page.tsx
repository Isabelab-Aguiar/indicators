import type { Metadata } from 'next'

import { Header } from '@/components/layout/header'
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics'
import { IndicatorsOverview } from '@/components/dashboard/indicators-overview'
import { MicroareaChart } from '@/components/dashboard/microarea-chart'
import { RecentPregnantWomen } from '@/components/dashboard/recent-pregnant-women'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Dashboard" description="Visão geral dos indicadores da ESF" />
      <div className="flex-1 space-y-8 overflow-y-auto p-6">
        <IndicatorsOverview />
        <section className="space-y-3">
          <div>
            <h2 className="text-foreground text-sm font-semibold tracking-tight">
              Pré-natal em números
            </h2>
            <p className="text-muted-foreground text-xs">
              Métricas operacionais agregadas das gestantes da sua ESF
            </p>
          </div>
          <DashboardMetrics />
        </section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MicroareaChart />
          <RecentPregnantWomen />
        </div>
      </div>
    </div>
  )
}
