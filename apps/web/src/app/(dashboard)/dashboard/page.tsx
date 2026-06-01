import type { Metadata } from 'next'

import { Header } from '@/components/layout/header'
import { CareLinesSummary } from '@/components/dashboard/care-lines-summary'
import { AllIndicatorsChart } from '@/components/dashboard/all-indicators-chart'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Dashboard" description="Visão geral dos indicadores da ESF" />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
          <CareLinesSummary />
          <AllIndicatorsChart />
        </div>
      </div>
    </div>
  )
}
