import type { Metadata } from 'next'
import { IndicatorPageHeader } from '@/components/layout/indicator-page-header'
import { C6Tabs } from '@/components/indicators/c6-tabs'

export const metadata: Metadata = {
  title: 'C6 · Cuidado da Pessoa Idosa · Indicadores APS',
}

export default function C6IndicadorPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <IndicatorPageHeader code="c6" showToolbar />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <C6Tabs />
      </div>
    </div>
  )
}
