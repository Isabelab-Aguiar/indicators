import type { Metadata } from 'next'
import { IndicatorPageHeader } from '@/components/layout/indicator-page-header'
import { C4Tabs } from '@/components/indicators/c4-tabs'

export const metadata: Metadata = {
  title: 'C4 · Diabetes · Indicadores APS',
}

export default function C4IndicadorPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <IndicatorPageHeader code="c4" showToolbar />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <C4Tabs />
      </div>
    </div>
  )
}
