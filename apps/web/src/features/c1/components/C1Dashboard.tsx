'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useC1Analytics } from '../hooks/useC1Analytics'
import { useC1Execucoes } from '../hooks/useC1Execucoes'
import { C1Header } from './C1Header'
import { C1HeroCard } from './C1HeroCard'
import { C1Filters } from './C1Filters'
import { C1Analytics } from './C1Analytics'
import { C1TabelaExecucoes } from './C1TabelaExecucoes'
import { C1Insights } from './C1Insights'
import { C1ImportacaoPdf } from './C1ImportacaoPdf'
import { C1SimuladorSection } from './C1SimuladorSection'

const SECTION_TABS = ['Visão Geral', 'Importar', 'Analytics', 'Histórico', 'Simulador'] as const
type SectionTab = (typeof SECTION_TABS)[number]

export function C1Dashboard() {
  const [activeSection, setActiveSection] = useState<SectionTab>('Visão Geral')
  const [year, setYear] = useState(new Date().getFullYear())
  const [quadrimestre, setQuadrimestre] = useState<number | null>(null)

  const periodo = quadrimestre !== null ? `${year}-Q${quadrimestre}` : undefined

  const { data: analytics, isLoading: analyticsLoading } = useC1Analytics()
  const { data: execucoes, isLoading: execucoesLoading } = useC1Execucoes({ periodo })

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <C1Header />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
          <div className="border-border flex flex-wrap items-center justify-between gap-2 border-b pb-3">
            <div className="flex flex-wrap gap-1">
              {SECTION_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSection(tab)}
                  className={
                    activeSection === tab
                      ? 'bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg px-3 py-1.5 text-xs font-medium transition-colors'
                  }
                >
                  {tab}
                </button>
              ))}
            </div>
            {activeSection !== 'Simulador' && (
              <C1Filters
                year={year}
                quadrimestre={quadrimestre}
                onYearChange={setYear}
                onQuadrimestreChange={setQuadrimestre}
              />
            )}
          </div>

          {activeSection === 'Visão Geral' && (
            <motion.div
              key="visao-geral"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <C1HeroCard execucoes={execucoes} isLoading={execucoesLoading} periodo={periodo} />
              <C1Insights analytics={analytics} isLoading={analyticsLoading} />
            </motion.div>
          )}

          {activeSection === 'Importar' && (
            <motion.div key="importar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <C1ImportacaoPdf periodo={periodo} />
            </motion.div>
          )}

          {activeSection === 'Analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <C1Analytics analytics={analytics} isLoading={analyticsLoading} />
            </motion.div>
          )}

          {activeSection === 'Histórico' && (
            <motion.div key="historico" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <C1TabelaExecucoes execucoes={execucoes} isLoading={execucoesLoading} />
            </motion.div>
          )}

          {activeSection === 'Simulador' && (
            <motion.div key="simulador" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <C1SimuladorSection />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
