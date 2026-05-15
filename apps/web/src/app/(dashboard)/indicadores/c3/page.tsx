import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { C3Tabs } from '@/components/indicators/c3-tabs'

export const metadata: Metadata = {
  title: 'C3 · Pré-Natal · Indicadores APS',
}

export default function C3IndicadorPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="C3 · Acompanhamento Pré-Natal"
        description="Análise de adesão às boas práticas do pré-natal por critério e gestante"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <C3Tabs />
      </div>
    </div>
  )
}
