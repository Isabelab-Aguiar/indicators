import type { Metadata } from 'next'

import { Header } from '@/components/layout/header'
import { IndicatorHubGrid } from '@/components/indicators/indicator-hub-grid'

export const metadata: Metadata = { title: 'Indicadores APS' }

export default function IndicadoresHubPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Indicadores APS"
        description="Linhas de cuidado avaliadas pelo Previne Brasil (C2 a C7)"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <IndicatorHubGrid />
      </div>
    </div>
  )
}
