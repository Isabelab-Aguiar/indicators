import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { C2Tabs } from '@/components/indicators/c2-tabs'

export const metadata: Metadata = {
  title: 'C2 · Desenvolvimento Infantil · Indicadores APS',
}

export default function C2IndicadorPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="C2 · Cuidado no Desenvolvimento Infantil"
        description="Avaliar o acesso e acompanhamento efetivo das crianças com até 2 anos em relação aos episódios de cuidados necessários."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <C2Tabs />
      </div>
    </div>
  )
}
