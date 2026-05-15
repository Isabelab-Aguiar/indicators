import type { Metadata } from 'next'

import { Header } from '@/components/layout/header'
import { C1Simulator } from '@/components/indicators/c1-simulator'

export const metadata: Metadata = {
  title: 'C1 · Mais Acesso à APS',
}

export default function C1IndicadorPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="C1 · Mais Acesso à APS"
        description="Equilíbrio entre demanda programada e demanda espontânea"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <C1Simulator />
      </div>
    </div>
  )
}
