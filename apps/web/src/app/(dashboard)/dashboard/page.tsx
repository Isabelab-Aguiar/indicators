import type { Metadata } from 'next'

import { Header } from '@/components/layout/header'
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics'
import { CareLinesSummary } from '@/components/dashboard/care-lines-summary'
import { MicroareaChart } from '@/components/dashboard/microarea-chart'
import { RecentPregnantWomen } from '@/components/dashboard/recent-pregnant-women'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Dashboard" description="Visao geral dos indicadores da ESF" />
      <div className="flex-1 space-y-8 overflow-y-auto p-4 sm:p-6">
        <section className="space-y-3">
          <div>
            <h2 className="text-foreground text-sm font-semibold tracking-tight">
              Pre-natal em numeros
            </h2>
            <p className="text-muted-foreground text-xs">
              Metricas operacionais agregadas das gestantes da sua ESF
            </p>
          </div>
          <DashboardMetrics />
        </section>

        <CareLinesSummary />

        <section className="space-y-3">
          <div>
            <h2 className="text-foreground text-sm font-semibold tracking-tight">
              Cobertura territorial
            </h2>
            <p className="text-muted-foreground text-xs">
              Distribuicao das gestantes por microarea e ultimas atualizacoes
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <MicroareaChart />
            <RecentPregnantWomen />
          </div>
        </section>
      </div>
    </div>
  )
}
