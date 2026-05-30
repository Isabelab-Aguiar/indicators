import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { C6Tabs } from '@/components/indicators/c6-tabs'

export const metadata: Metadata = {
  title: 'C6 · Cuidado da Pessoa Idosa · Indicadores APS',
}

export default function C6IndicadorPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="C6 — Cuidado da Pessoa Idosa"
        description="Avaliar o acesso e o acompanhamento efetivo das pessoas idosas em relação aos episódios de cuidados necessários."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <C6Tabs />
      </div>
    </div>
  )
}
