import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { C5Tabs } from '@/components/indicators/c5-tabs'

export const metadata: Metadata = {
  title: 'C5 · Hipertensão · Indicadores APS',
}

export default function C5IndicadorPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="C5 · Cuidado da Pessoa com Hipertensão"
        description="Avaliar o acesso e o acompanhamento efetivo das pessoas com hipertensão em relação aos episódios de cuidados necessários."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <C5Tabs />
      </div>
    </div>
  )
}
