import type { Metadata } from 'next'

import { Header } from '@/components/layout/header'
import { C3ClassificationDonut } from '@/components/dashboard/c3-classification-donut'
import { C3ComplianceChart } from '@/components/dashboard/c3-compliance-chart'
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics'
import { IndicatorsOverview } from '@/components/dashboard/indicators-overview'
import { MicroareaChart } from '@/components/dashboard/microarea-chart'
import { RecentPregnantWomen } from '@/components/dashboard/recent-pregnant-women'
import { SectionHeader } from '@/components/dashboard/section-header'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Dashboard" description="Visão geral dos indicadores da ESF" />
      <div className="flex-1 space-y-8 overflow-y-auto p-6">
        <IndicatorsOverview />

        <section className="space-y-3">
          <SectionHeader
            title="Pré-natal em números"
            description="Métricas operacionais agregadas das gestantes da sua ESF"
          />
          <DashboardMetrics />
        </section>

        <section className="space-y-3">
          <SectionHeader
            title="Análise de adesão (C3)"
            description="Cumprimento dos critérios de cuidado pré-natal por gestante"
            actionLabel="Ver detalhes"
            actionHref="/indicadores/c3"
          />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
            <C3ComplianceChart />
            <C3ClassificationDonut />
          </div>
        </section>

        <section className="space-y-3">
          <SectionHeader
            title="Cobertura territorial"
            description="Distribuição das gestantes por microárea e últimas atualizações"
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <MicroareaChart />
            <RecentPregnantWomen />
          </div>
        </section>
      </div>
    </div>
  )
}
