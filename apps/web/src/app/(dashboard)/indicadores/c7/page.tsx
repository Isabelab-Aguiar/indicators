import type { Metadata } from 'next'
import { IndicatorPageHeader } from '@/components/layout/indicator-page-header'
import { C7Tabs } from '@/components/indicators/c7-tabs'

export const metadata: Metadata = {
  title: 'C7 · Prevenção do Câncer · Indicadores APS',
}

export default function C7IndicadorPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <IndicatorPageHeader code="c7" showToolbar />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <C7Tabs />
      </div>
    </div>
  )
}
