import type { Metadata } from 'next'
import { IndicatorPageHeader } from '@/components/layout/indicator-page-header'
import { C2Tabs } from '@/components/indicators/c2-tabs'

export const metadata: Metadata = {
  title: 'C2 · Desenvolvimento Infantil · Indicadores APS',
}

export default function C2IndicadorPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <IndicatorPageHeader code="c2" showToolbar />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <C2Tabs />
      </div>
    </div>
  )
}
