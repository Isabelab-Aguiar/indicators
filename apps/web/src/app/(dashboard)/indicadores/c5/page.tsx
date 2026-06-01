import type { Metadata } from 'next'
import { IndicatorPageHeader } from '@/components/layout/indicator-page-header'
import { C5Tabs } from '@/components/indicators/c5-tabs'

export const metadata: Metadata = {
  title: 'C5 · Hipertensão · Indicadores APS',
}

export default function C5IndicadorPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <IndicatorPageHeader code="c5" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <C5Tabs />
      </div>
    </div>
  )
}
