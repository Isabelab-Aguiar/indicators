import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics'
import { MicroareaChart } from '@/components/dashboard/microarea-chart'
import { RecentPregnantWomen } from '@/components/dashboard/recent-pregnant-women'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Dashboard" description="Visão geral dos indicadores da ESF" />
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <DashboardMetrics />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MicroareaChart />
          <RecentPregnantWomen />
        </div>
      </div>
    </div>
  )
}
