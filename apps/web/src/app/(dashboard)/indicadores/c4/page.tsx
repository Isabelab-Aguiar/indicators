import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { C4Tabs } from '@/components/indicators/c4-tabs'

export const metadata: Metadata = {
  title: 'C4 · Diabetes · Indicadores APS',
}

export default function C4IndicadorPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="C4 · Cuidado da Pessoa com Diabetes"
        description="Avaliar o acesso e o acompanhamento efetivo das pessoas com diabetes em relação aos episódios de cuidados necessários."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <C4Tabs />
      </div>
    </div>
  )
}
