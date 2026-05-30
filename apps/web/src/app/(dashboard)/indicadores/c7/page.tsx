import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { C7Tabs } from '@/components/indicators/c7-tabs'

export const metadata: Metadata = {
  title: 'C7 · Prevenção do Câncer · Indicadores APS',
}

export default function C7IndicadorPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="C7 — Cuidado da Mulher na Prevenção do Câncer"
        description="Avaliar o acesso e o acompanhamento efetivo na saúde sexual e reprodutiva e na prevenção e detecção precoce de câncer de colo do útero e mama."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <C7Tabs />
      </div>
    </div>
  )
}
