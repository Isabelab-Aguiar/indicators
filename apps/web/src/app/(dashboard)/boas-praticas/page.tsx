import type { Metadata } from 'next'

import { Header } from '@/components/layout/header'
import { PracticeDetail } from '@/components/indicators/practice-detail'
import { PracticeOverview } from '@/components/indicators/practice-overview'
import { PracticeToc } from '@/components/indicators/practice-toc'
import { INDICATOR_LIST } from '@/lib/indicators-aps'

const ACCENT: Record<string, string> = {
  c2: 'from-sky-500/40 to-sky-500/0',
  c3: 'from-rose-500/40 to-rose-500/0',
  c4: 'from-violet-500/40 to-violet-500/0',
  c5: 'from-amber-500/40 to-amber-500/0',
  c6: 'from-emerald-500/40 to-emerald-500/0',
  c7: 'from-pink-500/40 to-pink-500/0',
}

export const metadata: Metadata = { title: 'Boas Práticas' }

export default function BoasPraticasPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Boas Práticas APS"
        description="Indicadores oficiais do Previne Brasil — metodologia, critérios e pontuação"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <PracticeOverview />
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            <aside className="hidden lg:block">
              <PracticeToc />
            </aside>
            <div className="space-y-5">
              {INDICATOR_LIST.map((indicator) => (
                <PracticeDetail
                  key={indicator.code}
                  indicator={indicator}
                  accent={ACCENT[indicator.code] ?? ''}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
