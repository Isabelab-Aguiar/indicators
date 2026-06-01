import type { Metadata } from 'next'

import { Header } from '@/components/layout/header'
import { CareLinesSummary } from '@/components/dashboard/care-lines-summary'
import { AllIndicatorsChart } from '@/components/dashboard/all-indicators-chart'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Dashboard" description="Visao geral dos indicadores da ESF" />
      <div className="flex-1 space-y-8 overflow-y-auto p-4 sm:p-6">
        <CareLinesSummary />

        <section className="space-y-3">
          <div>
            <h2 className="text-foreground text-sm font-semibold tracking-tight">
              Desempenho geral
            </h2>
            <p className="text-muted-foreground text-xs">
              Score medio por indicador Previne Brasil todos os eixos
            </p>
          </div>
          <AllIndicatorsChart />
        </section>
      </div>
    </div>
  )
}
