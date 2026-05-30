import type { Metadata } from 'next'

import { Header } from '@/components/layout/header'
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics'
import { IndicatorsOverview } from '@/components/dashboard/indicators-overview'
import { MicroareaChart } from '@/components/dashboard/microarea-chart'
import { RecentPregnantWomen } from '@/components/dashboard/recent-pregnant-women'
import { SectionHeader } from '@/components/dashboard/section-header'
import { C3ComplianceChart } from '@/components/dashboard/c3-compliance-chart'
import { C3ClassificationDonut } from '@/components/dashboard/c3-classification-donut'
import { C1EvolutionChart } from '@/components/dashboard/c1-evolution-chart'
import {
  C5ComplianceChart,
  C6ComplianceChart,
  C7ComplianceChart,
} from '@/components/dashboard/compliance-charts'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Dashboard" description="Visão geral dos indicadores da ESF" />
      <div className="flex-1 space-y-8 overflow-y-auto p-4 sm:p-6">
        {/* Bloco 1 — Cards de indicadores */}
        <IndicatorsOverview />

        {/* Bloco 2 — Métricas operacionais de pré-natal */}
        <section className="space-y-3">
          <SectionHeader
            title="Pré-natal em números"
            description="Métricas operacionais agregadas das gestantes da sua ESF"
          />
          <DashboardMetrics />
        </section>

        {/* Bloco 3 — C1 Mais Acesso */}
        <section className="space-y-3">
          <SectionHeader
            title="C1 — Mais Acesso à APS"
            description="Equilíbrio entre demanda programada e espontânea por período"
            actionLabel="Ver detalhes"
            actionHref="/indicadores/c1"
          />
          <C1EvolutionChart />
        </section>

        {/* Bloco 4 — C3 Pré-natal */}
        <section className="space-y-3">
          <SectionHeader
            title="C3 — Pré-natal (Gestantes)"
            description="Cumprimento dos critérios de cuidado pré-natal por gestante"
            actionLabel="Ver detalhes"
            actionHref="/indicadores/c3"
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
            <C3ComplianceChart />
            <C3ClassificationDonut />
          </div>
        </section>

        {/* Bloco 5 — C5 e C6 lado a lado */}
        <section className="space-y-3">
          <SectionHeader
            title="C5 e C6 — Hipertensos e Idosos"
            description="Adesão aos critérios de cuidado por grupo populacional"
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <C5ComplianceChart />
            <C6ComplianceChart />
          </div>
        </section>

        {/* Bloco 6 — C7 Saúde da Mulher */}
        <section className="space-y-3">
          <SectionHeader
            title="C7 — Saúde da Mulher"
            description="Rastreio e vacinação para mulheres elegíveis"
            actionLabel="Ver detalhes"
            actionHref="/indicadores/c7"
          />
          <C7ComplianceChart />
        </section>

        {/* Bloco 7 — Cobertura territorial */}
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
